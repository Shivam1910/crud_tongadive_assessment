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

  const createRecords = async (records) => {
    try {
      await createMutation.mutateAsync(records);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create records"
      );
    }
  };

  const updateRecords = async (records) => {
    try {
      await updateMutation.mutateAsync(records);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update records"
      );
    }
  };

  const deleteRecords = async (ids) => {
    try {
      await deleteMutation.mutateAsync(ids);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete records"
      );
    }
  };

  return {
    data: {
      items: data?.items || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    },
    isLoading,
    error,
    createRecords,
    updateRecords,
    deleteRecords,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};
