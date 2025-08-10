"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/service/api.service";

interface Todo {
  id: string;
  item: string;
  userId: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  content?: {
    entries: Todo[];
  };
  totalPages?: number;
  totalItems?: number;
}

export default function AdminPage() {
  const { token, user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["todos", page, debouncedSearch, filter],
    queryFn: async (): Promise<ApiResponse> => {
      const params: Record<string, any> = {
        page,
        rows: 10,
      };

      // Add searchFilters if search is not empty
      if (debouncedSearch.trim()) {
        params.searchFilters = JSON.stringify({
          item: debouncedSearch.trim(),
        });
      }

      // Add filters if filter is not "all"
      if (filter !== "all") {
        params.filters = JSON.stringify({
          isDone: filter === "done",
        });
      }

      try {
        const res = await api.get("/todos", { params });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!token,
    retry: 1,
  });

  const todos: Todo[] = data?.content?.entries || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "done" | "undone") => {
    setFilter(newFilter);
    setPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setFilter("all");
    setPage(1);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">To Do</h1>
        {(debouncedSearch || filter !== "all") && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search todos..."
            value={search}
            onChange={handleSearchChange}
          />
          {debouncedSearch && (
            <p className="text-sm text-gray-500 mt-1">
              Searching for: "{debouncedSearch}"
            </p>
          )}
        </div>

        <select
          value={filter}
          onChange={(e) =>
            handleFilterChange(e.target.value as "all" | "done" | "undone")
          }
          className="border rounded px-3 py-2 min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading
          ? "Loading..."
          : `Showing ${todos.length} of ${totalItems} todos`}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading todos:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">To do</th>
              <th className="px-4 py-2">Statue</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading todos...</span>
                  </div>
                </td>
              </tr>
            ) : todos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8">
                  <div>
                    <p className="text-gray-500 mb-2">No todos found</p>
                    {(debouncedSearch || filter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear filters to see all todos
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              todos.map((todo) => (
                <tr key={todo.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {user?.fullName || "Unknown User"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="max-w-xs truncate" title={todo.item}>
                      {todo.item}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-white text-sm font-medium",
                        todo.isDone ? "bg-green-500" : "bg-red-500"
                      )}
                    >
                      {todo.isDone ? "Done" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ‹ Previous
          </Button>

          {/* Page Numbers */}
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next ›
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Page {page} of {totalPages}
        </div>
      )}
    </div>
  );
}
