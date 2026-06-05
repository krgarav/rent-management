import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, registerUser } from "../api/tenant.service";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id, // prevents running before id exists
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      // optional: refresh users list if you have one
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};