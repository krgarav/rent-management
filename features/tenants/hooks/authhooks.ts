import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};