import { api } from "@/lib/axios";

export const addProperty = async (data: {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  rentPerUnit: number;
}) => {
  const response = await api.post("/properties", data);
  return response.data;
};

export const updateProperty = async (data: {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  rentPerUnit: number;
}) => {
  const response = await api.put(`/properties/${data.id}`, data);
  return response.data;
};

export const getProperties = async () => {
  const response = await api.get("/properties");

  return response.data;
};

export const deleteProperty = async (data: { id: string }) => {
  const response = await api.delete(`/properties/${data.id}`);

  return response.data;
};
