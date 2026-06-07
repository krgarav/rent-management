import { api } from '@/lib/axios';

export const generateBill = async (data: {
  userId: string;
  month: string;
  electricBill: {
    usage: {
      previousUnit: number;
      currentUnit: number;
    };
    billPhotoUrl: string;
    amount: number;
    status: string;
  };
  rent: {
    dueAmount: number;
    amount: number;
    status: string;
  };
  meta: {
    note: string;
    generatedBy: string;
  };
}) => {
  const response = await api.post('/bills', data);
  return response.data;
};


export const getAllBills = async (data: { id: string }) => {
  const response = await api.get(`/bills/tenant/${data.id}`);

  return response.data;
};