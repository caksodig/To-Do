import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "@/service/todo.service";
import { toast } from "sonner";

export const useTodos = (params?: {
  page?: number;
  rows?: number;
  search?: string;
  filter?: string;
}) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => TodoService.getAll(params),
    staleTime: 60 * 1000, // 1 minute
  });

  const createMutation = useMutation({
    mutationFn: TodoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Todo created successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      TodoService.update(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Todo updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: TodoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Todo deleted successfully");
    },
  });

  return {
    todos: data?.content?.entries || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    isLoading,
    error,
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
  };
};
