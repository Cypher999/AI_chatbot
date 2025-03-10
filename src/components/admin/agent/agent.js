"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Input from "@/components/ui/input";

// Sample data
const data = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `User  ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "User ", "Moderator"][i % 3], // Cycles through roles
}));

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

export default function Agent() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex + 1; // Convert to 1-based index

  // Calculate min and max page numbers
  let minPage = 1;
  let maxPage = totalPages;

  if (currentPage >= 6) {
    minPage = Math.max(1, currentPage - 4);
    maxPage = Math.min(totalPages, currentPage + 5);
  }

  // Adjust minPage if the difference between maxPage and currentPage is less than 5
  if (maxPage - currentPage < 5) {
    minPage = Math.max(1, maxPage - 9);
  }

  return (
    <div className="p-6 w-full max-w-4xl mx-auto shadow-xl bg-gray-800 rounded-md">
      {/* Search & Page Size */}
      <div className="block md:flex justify-between items-center mb-4">
        <Input
          icon={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full mb-2 md:w-1/3 md:mb-0 text-sm"
        />
        <select
          value={pagination.pageSize}
          onChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}
          className="border px-3 py-2 rounded-md text-sm"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {/* Previous Button */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-2 border rounded-md disabled:opacity-50 flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        {/* Page Number Buttons */}
        {Array.from({ length: maxPage - minPage + 1 }, (_, i) => (
          <button
            key={i + minPage - 1}
            onClick={() => table.setPageIndex(i + minPage - 1)}
            className={`px-3 py-2 border rounded-md ${table.getState().pagination.pageIndex === i + minPage - 1 ? "bg-gray-500 text-white" : ""}`}
          >
            {i + minPage}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-2 border rounded-md disabled:opacity-50 flex items-center gap-1"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}