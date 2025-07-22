// import { api } from "./api";

// export const getTodos = async (token: string) => {
//   try {
//     const res = await api.get("/todos", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("Error fetching todos:", error);
//     throw new Error(error.response?.data?.message || "Gagal mengambil todos");
//   }
// };

// export const createTodo = async (item: string, token: string) => {
//   try {
//     if (!token) throw new Error("Token tidak tersedia");

//     const res = await api.post(
//       "/todos",
//       { item },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data;
//   } catch (error: any) {
//     console.error(
//       "Error creating todo:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// export const updateTodo = async (
//   id: string,
//   isDone: boolean,
//   token: string
// ) => {
//   const res = await api.put(
//     `/todos/${id}`,
//     { isDone },
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   return res.data;
// };

// export const deleteTodo = async (id: string, token: string) => {
//   const res = await api.delete(`/todos/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

import { api } from "./api";

export const getTodos = async (token: string) => {
  try {
    const res = await api.get("/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching todos:", error);
    throw new Error(error.response?.data?.message || "Gagal mengambil todos");
  }
};

export const createTodo = async (item: string, token: string) => {
  try {
    const res = await api.post("/todos", { item });
    return res.data;
  } catch (error: any) {
    console.error("Error creating todo:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Gagal menambahkan todo");
  }
};

export const updateTodo = async (
  id: string,
  isDone: boolean,
  token: string
) => {
  try {
    const action = isDone ? "DONE" : "UNDONE";

    const res = await api.put(
      `/todos/${id}/mark`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error(
      "Error updating todo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTodo = async (id: string, token: string) => {
  try {
    console.log("Deleting todo:", { id, token: token ? "exists" : "missing" });
    const res = await api.delete(`/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error(
      "Error deleting todo:",
      error.response?.data || error.message
    );
    console.error("Full error:", error.response);
    throw error;
  }
};
