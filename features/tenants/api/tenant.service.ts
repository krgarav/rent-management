import { api } from '@/lib/axios';


export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "tenant" | "manager";
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};


export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getTenantById = async (id: string) => {
  const response = await api.get(`/tenants/${id}`);
  return response.data;
};

export const getTenantTransactions = async (tenantId: string) => {
  const response = await api.get(`/tenants/${tenantId}/transactions`);
  return response.data;
};

export const getRentPayments = async (tenantId: string) => {
  const response = await api.get(`/rent-payments`, {
    params: { tenantId }
  });
  return response.data;
};
