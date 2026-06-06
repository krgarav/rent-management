import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../api/tenant.service";


export const useTenant = () => {
  return useQuery({
   queryKey: ["tenant"],
    queryFn: getTenants,
  });
};