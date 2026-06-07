import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { generateBill, getBills, updateBill, deleteBill } from 
import { generateBill, getAllBills } from "../api/bill.service";


export const useBills = (id: string) => {
  return useQuery({
    queryKey: ["bills", id],
    queryFn: () => getAllBills({ id }),
    enabled: !!id, // prevents running before id exists
  });
};

// CREATE bill (generate)
export const useGenerateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

// // UPDATE bill
// export const useUpdateBill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateBill,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bills"] });
//     },
//   });
// };

// // DELETE bill (optimistic update)
// export const useDeleteBill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: deleteBill,

//     onMutate: async (id: string) => {
//       await queryClient.cancelQueries({ queryKey: ["bills"] });

//       const previous = queryClient.getQueryData(["bills"]);

//       queryClient.setQueryData(["bills"], (old: any[] = []) =>
//         old.filter((b) => b.id !== id)
//       );

//       return { previous };
//     },

//     onError: (_err, _id, context) => {
//       queryClient.setQueryData(["bills"], context?.previous);
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["bills"] });
//     },
//   });
// };