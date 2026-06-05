import { useMutation } from "@tanstack/react-query";
import { login } from "../api/tenant.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};