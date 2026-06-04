'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Tenant, Property, RentPayment, Expense, Document, Notification } from '@/types'
import { 
  MOCK_TENANTS, 
  MOCK_PROPERTIES, 
  MOCK_RENT_PAYMENTS, 
  MOCK_EXPENSES, 
  MOCK_DOCUMENTS, 
  MOCK_NOTIFICATIONS 
} from '@/lib/mock-data'

interface DataContextType {
  tenants: Tenant[]
  properties: Property[]
  payments: RentPayment[]
  expenses: Expense[]
  documents: Document[]
  notifications: Notification[]
  
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTenant: (id: string, tenant: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProperty: (id: string, property: Partial<Property>) => void
  deleteProperty: (id: string) => void
  
  addPayment: (payment: Omit<RentPayment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePayment: (id: string, payment: Partial<RentPayment>) => void
  
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void
  deleteDocument: (id: string) => void
  
  markNotificationAsRead: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS)
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES)
  const [payments, setPayments] = useState<RentPayment[]>(MOCK_RENT_PAYMENTS)
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const addTenant = useCallback((tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: `tenant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTenants((prev) => [...prev, newTenant])
  }, [])

  const updateTenant = useCallback((id: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? { ...tenant, ...updates, updatedAt: new Date() }
          : tenant
      )
    )
  }, [])

  const deleteTenant = useCallback((id: string) => {
    setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
  }, [])

  const addProperty = useCallback((property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProperties((prev) => [...prev, newProperty])
  }, [])

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === id
          ? { ...property, ...updates, updatedAt: new Date() }
          : property
      )
    )
  }, [])

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((property) => property.id !== id))
  }, [])

  const addPayment = useCallback((payment: Omit<RentPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: RentPayment = {
      ...payment,
      id: `payment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPayments((prev) => [...prev, newPayment])
  }, [])

  const updatePayment = useCallback((id: string, updates: Partial<RentPayment>) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
          ? { ...payment, ...updates, updatedAt: new Date() }
          : payment
      )
    )
  }, [])

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setExpenses((prev) => [...prev, newExpense])
  }, [])

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? { ...expense, ...updates, updatedAt: new Date() }
          : expense
      )
    )
  }, [])

  const addDocument = useCallback((document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setDocuments((prev) => [...prev, newDocument])
  }, [])

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }, [])

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? { ...notif, read: true }
          : notif
      )
    )
  }, [])

  return (
    <DataContext.Provider
      value={{
        tenants,
        properties,
        payments,
        expenses,
        documents,
        notifications,
        addTenant,
        updateTenant,
        deleteTenant,
        addProperty,
        updateProperty,
        deleteProperty,
        addPayment,
        updatePayment,
        addExpense,
        updateExpense,
        addDocument,
        deleteDocument,
        markNotificationAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
