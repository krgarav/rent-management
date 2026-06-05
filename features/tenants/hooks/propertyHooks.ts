import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProperty,
  deleteProperty,
  getProperties,
  updateProperty,
} from "../api/properties.service";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });
};
export const useAddProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};


export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["properties"] });

      const previous = queryClient.getQueryData(["properties"]);

      queryClient.setQueryData(["properties"], (old: any[] = []) =>
        old.filter((p) => p.id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["properties"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
