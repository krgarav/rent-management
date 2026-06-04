/* Enums */
export enum UserRole {
  ADMIN = 'admin',
  PROPERTY_MANAGER = 'property_manager',
  TENANT = 'tenant',
}

export enum PropertyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial',
}

export enum ExpenseCategory {
  MAINTENANCE = 'maintenance',
  UTILITIES = 'utilities',
  PROPERTY_TAX = 'property_tax',
  INSURANCE = 'insurance',
  MANAGEMENT = 'management',
  OTHER = 'other',
}

/* Types */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  name: string
  address: string
  type: 'residential' | 'commercial'
  units: number
  rentAmount: number
  image?: string
  status: PropertyStatus
  managerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  propertyId: string
  email: string
  name: string
  phone: string
  leaseStartDate: Date
  leaseEndDate: Date
  rentAmount: number
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface RentPayment {
  id: string
  tenantId: string
  propertyId: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: PaymentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  propertyId: string
  category: ExpenseCategory
  amount: number
  description: string
  date: Date
  receipt?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  propertyId?: string
  tenantId?: string
  name: string
  type: 'lease' | 'invoice' | 'receipt' | 'other'
  url: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  description: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export interface DashboardStats {
  totalProperties: number
  totalTenants: number
  totalRentCollected: number
  pendingPayments: number
  totalExpenses: number
}
