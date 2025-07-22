import { api } from "./api";

export const getUsers = async (
  token: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
