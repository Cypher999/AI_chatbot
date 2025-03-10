"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Input from "@/components/ui/input";
import { getAll } from "@/utils/services/admin/agent";
import Button from "@/components/ui/button";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "agent name" },
  { accessorKey: "description", header: "description" },
];
export default function Agent() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0); 
  const [maxPage,setMaxPage]=useState(0)
  const [minPage,setMinPage]=useState(0)
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
  useEffect(() => {
    const fetchData = async () => {
      const result = await getAll(pagination.pageIndex, pagination.pageSize, globalFilter);
      setData(result.data);
      setTotalCount(result.totalCount);
  
      // Calculate total pages based on the new totalCount
      const totalPages = Math.ceil(result.totalCount / pagination.pageSize);
      const currentPage = pagination.pageIndex + 1; // Convert to 1-based index
  
      // Calculate minPage and maxPage
      let newMinPage = 1;
      let newMaxPage = totalPages;
  
      if (currentPage >= 6) {
        newMinPage = Math.max(1, currentPage - 4);
        newMaxPage = Math.min(totalPages, currentPage + 5);
      }
  
      // Adjust minPage if the difference between maxPage and currentPage is less than 5
      if (newMaxPage - currentPage < 5) {
        newMinPage = Math.max(1, newMaxPage - 9);
      }
  
      // Update state for minPage and maxPage only if they have changed
      if (newMinPage !== minPage || newMaxPage !== maxPage) {
        setMinPage(newMinPage);
        setMaxPage(newMaxPage);
      }
    };
  
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  

  return (
    <div className="p-6 w-full max-w-4xl mx-auto shadow-xl bg-gray-800 rounded-md">
       <Button
          className="px-3 py-2 mb-4"
        >
          <Plus size={16} />
          <span className="ml-2">Add new Agent</span>
        </Button>
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