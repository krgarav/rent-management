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