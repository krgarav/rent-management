# Rent Expense Management Dashboard

A modern, production-ready SaaS dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI. Features role-based access control for Admin, Property Manager, and Tenant users.

## 🚀 Features

### Authentication & Authorization
- Mock authentication system with localStorage persistence
- Three demo users: Admin, Property Manager, Tenant
- Role-based route protection and UI visibility
- Dark/light theme toggle with persistence

### Role-Based Dashboards

#### Admin Dashboard
- Full access to all features
- Comprehensive analytics and reports
- User and property management
- Complete expense tracking

#### Property Manager Dashboard
- Manage assigned properties
- Track tenant payments
- Monitor expenses
- Generate property-specific reports
- Document management

#### Tenant Dashboard
- View lease details
- Track payment history
- Upcoming payment notifications
- Access to lease documents
- Personal settings

### Core Features

**Properties Management**
- Property listing with filters
- Status tracking (Active, Inactive, Maintenance)
- Property details and statistics
- Search functionality

**Tenants Management**
- Comprehensive tenant directory
- Lease information
- Contact details
- Rent amount tracking

**Rent Payments**
- Payment history tracking
- Status management (Paid, Pending, Overdue, Partial)
- Due date monitoring
- Tenant payment filtering

**Expense Tracking**
- Categorized expenses (Maintenance, Utilities, Property Tax, Insurance, Management, Other)
- Expense history
- Category-based filtering
- Total expense calculations

**Reports & Analytics**
- Monthly revenue vs. expenses charts
- Payment status pie charts
- Expense breakdown by category
- Profit trending

**Documents**
- Document upload and management
- Type classification (Lease, Invoice, Receipt, Other)
- Download functionality
- Role-based access

**Notifications**
- Real-time alerts
- Payment reminders
- Expense notifications
- Unread notification filtering

**Settings**
- Profile information management
- Theme preferences
- Password management
- Account security

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.2
- **UI Components**: Shadcn/UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand (providers)
- **Data Fetching**: React Query patterns (mock)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Custom mock provider
- **Theme**: Dark/Light mode with CSS variables

## 📁 Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── globals.css                # Theme system and design tokens
│   ├── page.tsx                   # Login page
│   └── dashboard/
│       ├── layout.tsx             # Dashboard layout with sidebar
│       ├── page.tsx               # Dashboard home
│       ├── properties/page.tsx    # Properties list
│       ├── tenants/page.tsx       # Tenants list
│       ├── rent-payments/page.tsx # Rent payments tracking
│       ├── expenses/page.tsx      # Expenses management
│       ├── reports/page.tsx       # Analytics & reports
│       ├── documents/page.tsx     # Document management
│       ├── notifications/page.tsx # Notifications center
│       └── settings/page.tsx      # User settings
│
├── components/
│   ├── index.ts                   # Component exports
│   ├── protected-route.tsx        # Protected route wrapper
│   ├── dashboard-layout.tsx       # Main dashboard layout
│   ├── badges/
│   │   └── status-badge.tsx       # Status indicator component
│   ├── cards/
│   │   └── stats-card.tsx         # Statistics card component
│   ├── dialogs/
│   │   └── confirm-dialog.tsx     # Confirmation dialog
│   ├── inputs/
│   │   └── search-bar.tsx         # Search input component
│   ├── skeletons/
│   │   └── loading-skeleton.tsx   # Loading skeleton
│   └── tables/
│       └── data-table.tsx         # Reusable data table with pagination
│
├── providers/
│   ├── auth-provider.tsx          # Authentication context
│   └── theme-provider.tsx         # Theme context (dark/light)
│
├── lib/
│   ├── utils.ts                   # Utility functions (cn)
│   └── mock-data.ts               # Mock data for demo
│
├── types/
│   └── index.ts                   # TypeScript type definitions
│
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── next.config.mjs                # Next.js configuration
```

## 🎨 Design System

### Color Palette (Dark Mode)
- **Background**: #0f1117
- **Foreground**: #e1e7ef
- **Primary**: #06b6d4 (Cyan)
- **Success**: #3fb950 (Green)
- **Warning**: #d29922 (Yellow)
- **Destructive**: #f85149 (Red)
- **Info**: #79c0ff (Blue)

### Semantic Tokens
All colors are defined as CSS variables for consistent theming:
- `--background` and `--foreground`
- `--card` and `--card-foreground`
- `--primary`, `--success`, `--warning`, `--destructive`
- `--border`, `--muted`, `--input`
- Responsive chart colors (`--chart-1` through `--chart-5`)

## 🔐 Authentication Flow

1. **Login Page**: Select role (Admin/Manager/Tenant)
2. **Session Storage**: User stored in localStorage
3. **Protected Routes**: Dashboard routes require authentication
4. **Auto-redirect**: Unauthenticated users redirected to login
5. **Logout**: Clears session and returns to login

### Demo Users
```typescript
// Admin
Email: admin@rentmanagement.com
Role: admin

// Property Manager
Email: manager@rentmanagement.com
Role: property_manager

// Tenant
Email: tenant@rentmanagement.com
Role: tenant
```

## 📊 Components Library

### StatsCard
Displays key metrics with icon, value, trend indicator
```tsx
<StatsCard
  label="Total Properties"
  value={stats.totalProperties}
  icon={<Building2 />}
  color="primary"
  trend={{ value: 12, isPositive: true }}
/>
```

### DataTable
Reusable table with sorting, pagination, custom rendering
```tsx
<DataTable
  data={properties}
  columns={columns}
  itemsPerPage={10}
  onRowClick={handleRowClick}
/>
```

### StatusBadge
Displays status with appropriate colors
```tsx
<StatusBadge status="paid" />
<StatusBadge status="overdue" />
```

### SearchBar
Searchable input with icon
```tsx
<SearchBar
  placeholder="Search..."
  value={searchTerm}
  onChange={handleChange}
/>
```

### ConfirmDialog
Modal confirmation dialog
```tsx
<ConfirmDialog
  open={isOpen}
  title="Delete Property"
  description="Are you sure?"
  onConfirm={handleDelete}
/>
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Login Demo

1. Select "Admin" role
2. Click "Login"
3. Explore the admin dashboard with full access
4. Navigate to different sections via sidebar
5. Switch roles via Settings → Theme/Logout

## 🔧 Key Features

### Role-Based Navigation
The sidebar automatically filters menu items based on user role:
- Admins see: Dashboard, Properties, Tenants, Payments, Expenses, Reports, Documents, Notifications, Settings
- Managers see: Dashboard, Properties, Tenants, Payments, Expenses, Reports, Documents, Notifications, Settings
- Tenants see: Dashboard, Payments, Documents, Notifications, Settings

### Mock Data Integration
All pages use mock data from `lib/mock-data.ts`:
- 3 sample properties with images
- 4 sample tenants with lease info
- 4 rent payments with various statuses
- 4 expense entries with categories
- 3 documents (leases and policies)
- 3 notifications with type indicators

### Charts & Analytics
Recharts integration for:
- Bar charts (Revenue vs. Expenses)
- Line charts (Payment Trends)
- Pie charts (Payment Status Distribution)
- Responsive container with custom styling

### Form Validation
React Hook Form + Zod for:
- Type-safe form handling
- Validation rules
- Error messages
- Form state management

### Responsive Design
Mobile-first approach with:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Viewport optimization

## 🔄 Routing Structure

```
/                           → Login page (public)
/dashboard                  → Dashboard home (protected)
/dashboard/properties       → Properties list (admin/manager)
/dashboard/tenants          → Tenants list (admin/manager)
/dashboard/rent-payments    → Rent payments (all roles)
/dashboard/expenses         → Expenses (admin/manager)
/dashboard/reports          → Reports (admin/manager)
/dashboard/documents        → Documents (all roles)
/dashboard/notifications    → Notifications (all roles)
/dashboard/settings         → Settings (all roles)
```

## 🎯 Future Enhancements

1. **Backend Integration**
   - Connect to NestJS REST API
   - Replace mock data with API calls
   - Implement actual authentication

2. **Cloudinary Integration**
   - Property image uploads
   - Document storage
   - Image optimization

3. **Advanced Features**
   - Tenant portals
   - Automated rent reminders
   - Expense receipts OCR
   - Multi-property management
   - Advanced filtering and search
   - Export reports to PDF

4. **Real-time Updates**
   - WebSocket integration
   - Live notifications
   - Real-time data sync

## 📝 Notes

- This is a **frontend-only** implementation with mock data
- Designed for integration with NestJS backend
- All components are fully responsive
- Dark mode is the default (toggle in Settings)
- TypeScript strict mode enabled
- Production-ready code quality and patterns

## 🤝 Integration Points

When connecting to backend:

1. **Authentication**: Replace mock provider with JWT/OAuth
2. **API Calls**: Replace `MOCK_*` data with API endpoints
3. **File Upload**: Integrate Cloudinary SDK for uploads
4. **Real-time**: Add WebSocket for live updates
5. **State**: Replace context with TanStack Query for caching

## 📖 Documentation

Comprehensive components documentation available in `/components` directory with JSDoc comments and TypeScript types for all exported components.
