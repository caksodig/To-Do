import { api } from "./api.service";
import { Todo, PaginatedResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";

export const TodoService = {
  getAll: async (params?: {
    page?: number;
    rows?: number;
    search?: string;
    filter?: string;
  }) => {
    const token = useAuthStore.getState().token;
    const { data } = await api.get<PaginatedResponse<Todo>>("/todos", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  create: async (item: string) => {
    const token = useAuthStore.getState().token;
    const { data } = await api.post(
      "/todos",
      { item },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  update: async (id: string, isDone: boolean) => {
    const token = useAuthStore.getState().token;
    const { data } = await api.put(
      `/todos/${id}/mark`,
      {
        isDone: isDone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  delete: async (id: string) => {
    const token = useAuthStore.getState().token;
    const { data } = await api.delete(`/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
