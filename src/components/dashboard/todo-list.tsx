"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/todos";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TodoList() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const queryClient = useQueryClient();

  //  Ambil daftar todo
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(token!),
    enabled: !!token,
  });

  const todos = data?.content?.entries || [];

  const { mutate: addTodo, isPending: isAdding } = useMutation({
    mutationFn: (item: string) => createTodo(item, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      toast.success("Todo berhasil ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan todo"),
  });

  const { mutate: toggleTodo } = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      updateTodo(id, isDone, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { mutate: removeTodo } = useMutation({
    mutationFn: (id: string) => deleteTodo(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo dihapus");
    },
  });

  if (isLoading) return <p className="p-4">Memuat data...</p>;

  return (
    <main className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Todo</h1>
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            router.push("/auth/login");
            toast.info("Berhasil logout");
          }}
          className="text-sm px-3 py-1 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* Form tambah todo */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim() !== "") addTodo(title);
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Tulis todo baru"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={isAdding}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isAdding ? "Menambah..." : "Tambah"}
        </button>
      </form>

      <Table>
        <TableCaption>Daftar Todo kamu.</TableCaption>
        <TableBody>
          {todos
            ?.filter((todo: any) => {
              if (filter === "done") return todo.isDone;
              if (filter === "undone") return !todo.isDone;
              return true;
            })
            .map((todo: any, index: number) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.isDone}
                    onCheckedChange={(checked) =>
                      toggleTodo({ id: todo.id, isDone: checked as boolean })
                    }
                  />
                </TableCell>
                <TableCell
                  className={`text-sm ${
                    todo.isDone ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.item}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="space-y-2 mt-4">
        {todos.map((todo: any) => (
          <div key={todo.id} className="flex justify-end">
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-xs px-2 py-1 rounded bg-red-500 text-white"
            >
              Deleted Selected
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
