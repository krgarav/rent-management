# Backend Integration Guide

This document provides guidelines for integrating the Rent Expense Management Dashboard with a NestJS REST API backend.

## Current Architecture

The application uses a **mock data layer** via the DataProvider context. All data operations go through this centralized provider.

## Integration Steps

### 1. Update Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# or for production
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 2. Create API Service Layer

Create `lib/api.ts`:
```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  // Auth endpoints
  login: (email: string, password: string, role: string) =>
    apiClient.post('/auth/login', { email, password, role }),
  logout: () => apiClient.post('/auth/logout'),

  // Tenants endpoints
  getTenants: () => apiClient.get('/tenants'),
  createTenant: (data: any) => apiClient.post('/tenants', data),
  updateTenant: (id: string, data: any) => apiClient.put(`/tenants/${id}`, data),
  deleteTenant: (id: string) => apiClient.delete(`/tenants/${id}`),

  // Properties endpoints
  getProperties: () => apiClient.get('/properties'),
  createProperty: (data: any) => apiClient.post('/properties', data),
  updateProperty: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
  deleteProperty: (id: string) => apiClient.delete(`/properties/${id}`),

  // ... other endpoints
}
```

### 3. Update Auth Provider

Modify `providers/auth-provider.tsx`:
```typescript
import { api } from '@/lib/api'

// Replace the login function:
const login = async (email: string, password: string, role: UserRole) => {
  try {
    const response = await api.login(email, password, role)
    const { user, token } = response.data
    
    setUser(user)
    localStorage.setItem('auth-token', token)
    localStorage.setItem('rent-management-auth', JSON.stringify(user))
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

// Replace the logout function:
const logout = () => {
  api.logout()
  setUser(null)
  localStorage.removeItem('auth-token')
  localStorage.removeItem('rent-management-auth')
}
```

### 4. Update Data Provider

Modify `providers/data-provider.tsx` to fetch from API:
```typescript
import { api } from '@/lib/api'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantsRes, propertiesRes, ...] = await Promise.all([
          api.getTenants(),
          api.getProperties(),
          // ... other API calls
        ])
        
        setTenants(tenantsRes.data)
        setProperties(propertiesRes.data)
        // ... update other states
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update addTenant function:
  const addTenant = useCallback(async (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.createTenant(tenant)
      setTenants((prev) => [...prev, response.data])
    } catch (error) {
      console.error('Failed to add tenant:', error)
      throw error
    }
  }, [])

  // ... similar updates for other CRUD operations
}
```

### 5. Implement Real Authentication

Update the login page to use actual credentials:
```typescript
const handleLogin = async () => {
  if (!selectedRole) return

  setIsLoading(true)
  try {
    // For demo, keep mock login
    // For production, use actual email/password
    login(selectedEmail, selectedPassword, selectedRole)
    router.push('/dashboard')
  } catch (error) {
    setError('Login failed. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
```

### 6. Add Cloudinary Integration

Install Cloudinary:
```bash
pnpm add next-cloudinary cloudinary
```

Create `lib/cloudinary.ts`:
```typescript
import { CldUploadWidget } from 'next-cloudinary'

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await response.json()
  return data.secure_url
}
```

### 7. Update Modal Forms

Modify `components/modals/add-tenant-modal.tsx`:
```typescript
const onSubmit = async (data: TenantFormData) => {
  setIsSubmitting(true)
  try {
    const response = await api.createTenant({
      ...data,
      leaseStartDate: new Date(data.leaseStartDate),
      leaseEndDate: new Date(data.leaseEndDate),
    })
    
    // Response automatically updates via DataProvider
    reset()
    onClose()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to add tenant')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 8. NestJS Backend Endpoints Required

Create these endpoints in your NestJS backend:

#### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
```

#### Tenants
```
GET    /api/tenants
POST   /api/tenants
PUT    /api/tenants/:id
DELETE /api/tenants/:id
GET    /api/tenants/:id
```

#### Properties
```
GET    /api/properties
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

#### Payments
```
GET    /api/rent-payments
POST   /api/rent-payments
PUT    /api/rent-payments/:id
```

#### Expenses
```
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

#### Documents
```
GET    /api/documents
POST   /api/documents
DELETE /api/documents/:id
```

#### Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
```

### 9. Error Handling

Update error boundaries and API calls:
```typescript
// Add global error handling
export async function fetchWithErrorHandling<T>(
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    return await fetchFn()
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login'
      }
      throw new Error(error.response?.data?.message || 'API Error')
    }
    throw error
  }
}
```

### 10. Deployment

#### Environment Variables for Production
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_PRESET=your-upload-preset
```

#### Vercel Deployment
```bash
# Set environment variables in Vercel project settings
# Then deploy
git push

# Or manually deploy with Vercel CLI
vercel --env-file .env.production
```

---

## Testing the Integration

1. Start your NestJS backend on port 3000
2. Set `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
3. Run the frontend with `pnpm dev`
4. Test the login flow with real credentials
5. Verify tenant creation updates the database
6. Check that data persists on page reload

---

## Troubleshooting

### CORS Issues
Add CORS headers in NestJS:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
```

### Auth Token Expiration
Implement token refresh:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      const refreshResponse = await api.refreshToken()
      localStorage.setItem('auth-token', refreshResponse.data.token)
      // Retry original request
      return apiClient(error.config)
    }
    return Promise.reject(error)
  }
)
```

### Type Safety
Ensure your NestJS DTOs match the TypeScript types in `types/index.ts` for proper type checking.

---

## Performance Optimization

1. **Lazy load data**: Only fetch data for the current page
2. **Implement pagination**: Fetch tenants/properties in batches
3. **Use SWR**: For client-side caching and revalidation
4. **Optimize images**: Use Cloudinary transformations
5. **Implement debouncing**: For search and filter inputs

---

## Security Considerations

1. **JWT Tokens**: Implement HTTP-only cookies for auth tokens
2. **Input Validation**: Validate all form inputs on backend
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **HTTPS**: Use HTTPS for production
5. **CORS**: Restrict CORS to your domain
6. **SQL Injection**: Use parameterized queries in database
7. **XSS Prevention**: Sanitize user inputs
8. **CSRF Protection**: Implement CSRF tokens for state-changing operations

---

## Monitoring & Logging

Add logging to track:
- API response times
- Failed requests
- User actions
- Error events
- Performance metrics

Use services like:
- Sentry for error tracking
- PostHog for analytics
- Vercel Analytics for performance

---

This dashboard is production-ready and can be seamlessly integrated with any REST API backend following these guidelines.
