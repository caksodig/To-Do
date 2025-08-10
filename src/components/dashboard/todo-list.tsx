"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "@/service/todo.service";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, Plus, LogOut, Trash2, CheckCircle2, Circle } from "lucide-react";

interface Todo {
  id: string;
  item: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterType = "all" | "done" | "undone";

export default function TodoList() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Load & Save selectedTodos to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedTodos");
    if (saved) {
      setSelectedTodos(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedTodos",
      JSON.stringify(Array.from(selectedTodos))
    );
  }, [selectedTodos]);

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => TodoService.getAll(),
    enabled: !!token,
  });

  const todos: Todo[] = data?.content?.entries || [];

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "done") return todo.isDone;
      if (filter === "undone") return !todo.isDone;
      return true;
    });
  }, [todos, filter]);

  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.isDone).length;
  }, [todos]);

  const totalCount = todos.length;

  const { mutate: addTodo, isPending: isAdding } = useMutation({
    mutationFn: (item: string) => TodoService.create(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setFilter("all");
      toast.success("Todo berhasil ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan todo"),
  });

  const { mutate: toggleTodo } = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      TodoService.update(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: removeTodo } = useMutation({
    mutationFn: (id: string) => TodoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo dihapus");
    },
  });

  const { mutate: bulkDeleteTodos, isPending: isDeleting } = useMutation({
    mutationFn: async (todoIds: string[]) => {
      await Promise.all(todoIds.map((id) => TodoService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodos(new Set());
      localStorage.removeItem("selectedTodos");
      toast.success(`Todo berhasil dihapus`);
    },
    onError: () => toast.error("Gagal menghapus todo"),
  });

  const handleSelectTodo = (todoId: string, checked: boolean) => {
    const newSelected = new Set(selectedTodos);
    checked ? newSelected.add(todoId) : newSelected.delete(todoId);
    setSelectedTodos(newSelected);
  };

  const handleCombinedAction = (todoId: string, checked: boolean) => {
    handleSelectTodo(todoId, checked);
    toggleTodo({
      id: todoId,
      isDone: checked,
    });
  };

  const handleBulkDelete = () => {
    if (selectedTodos.size > 0) {
      bulkDeleteTodos(Array.from(selectedTodos));
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Todo</h1>
          <p className="text-gray-600 mt-1">
            {completedCount} dari {totalCount} tugas selesai
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            useAuthStore.getState().logout();
            router.push("/auth/login");
            toast.info("Berhasil logout");
          }}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Todo</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <Circle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Belum Selesai
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalCount - completedCount}
                </p>
              </div>
              <X className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo Card */}
      <Card className="w-full h-[634px] rounded-[24px] border border-gray-200 p-[64px] flex flex-col gap-[64px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7D7D7D]">
            Add a new task
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (title.trim() !== "") addTodo(title);
            }}
            className="flex gap-3 mb-5"
          >
            <Input
              className="flex-1 font-medium"
              placeholder="Tulis todo baru..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button
              className="bg-[#0062FF] hover:bg-[#0052cc] "
              type="submit"
              disabled={isAdding || !title.trim()}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menambah...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add ToDo
                </>
              )}
            </Button>
          </form>

          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {filter === "all"
                  ? "Belum ada todo. Tambahkan todo pertama Anda!"
                  : `Tidak ada todo ${
                      filter === "done" ? "yang selesai" : "yang belum selesai"
                    }.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableBody>
                {filteredTodos.map((todo) => (
                  <TableRow key={todo.id} className="group hover:bg-gray-50">
                    <TableCell className="w-12">
                      <Checkbox
                        className="cursor-pointer bg-[#E6E6E6] data-[state=checked]:bg-green-100 data-[state=checked]:text-green-600 border-none "
                        checked={selectedTodos.has(todo.id)}
                        onCheckedChange={(checked) =>
                          handleCombinedAction(todo.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="flex-1">
                      <div className="text-sm font-normal">{todo.item}</div>
                    </TableCell>
                    <TableCell className="w-24">
                      <Badge
                        variant={todo.isDone ? "default" : "secondary"}
                        className={
                          todo.isDone ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {todo.isDone ? "Selesai" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-16">
                      <div
                        className={`flex justify-center ${
                          todo.isDone ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {todo.isDone ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Bulk Delete Button */}
          {selectedTodos.size > 0 && (
            <div className="flex items-center justify-between mx-1.5 my-5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menghapus...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus {selectedTodos.size} yang dipilih
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus {selectedTodos.size}{" "}
                      todo yang dipilih? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
