import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "../services/api";
import { toast } from "react-toastify";

export const useData = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  // Fetch all data
  const { data, isLoading, error } = useQuery({
    queryKey: ["data", page, limit],
    queryFn: () => dataService.getAll(page, limit),
  });

  // Bulk create mutation
  const createMutation = useMutation({
    mutationFn: dataService.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries(["data"]);
      toast.success("Records created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create records");
    },
  });

  // Bulk update mutation
  const updateMutation = useMutation({
    mutationFn: dataService.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries(["data"]);
      toast.success("Records updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update records");
    },
  });

  // Bulk delete mutation
  const deleteMutation = useMutation({
    mutationFn: dataService.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries(["data"]);
      toast.success("Records deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete records");
    },
  });

  return {
    data,
    isLoading,
    error,
    createRecords: createMutation.mutate,
    updateRecords: updateMutation.mutate,
    deleteRecords: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};
