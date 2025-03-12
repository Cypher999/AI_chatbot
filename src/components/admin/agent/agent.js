"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BotIcon, BotOff, Check, ChevronLeft, ChevronRight, Edit, Plus, Search, Trash,X } from "lucide-react";
import Input from "@/components/ui/input";
import { getAll } from "@/utils/services/admin/agent";
import Button from "@/components/ui/button";
import ModalAdd from "./modalAdd";
import Swal from "sweetalert2";
import { toggleBot } from "@/utils/services/admin/agent";
import Loading from "@/components/shared/loading";
export default function Agent() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [data, setData] = useState([]); 
  const [maxPage,setMaxPage]=useState(0)
  const [totalCount,setTotalCount]=useState(0)
  const [minPage,setMinPage]=useState(0)
  const handleToggleBot=async function(id){
    Swal.fire({
      title: 'Enable',
      text: `Enable bot with id ${id}?`,
      icon:'question',
      background: "var(--color-gray-800)",
      color: "#fff",
      showCancelButton: true,
      confirmButtonText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg> <span class="ml-3">Yes</span>`,
      cancelButtonText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> <span class="ml-3">Cancel</span>`,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'relative flex items-center border border-1 rounded p-2 cursor-pointer transition border-green-600 text-green-600 hover:bg-green-600 hover:text-white  px-3 py-1 mx-2',
        cancelButton: 'relative flex items-center border border-1 rounded p-2 cursor-pointer transition border-red-600 text-red-600 hover:bg-red-600 hover:text-white  px-3 py-1 mx-2'
      },
  }).then(async (e) => {
      if(e.isConfirmed){
          setLoading(true)
          const req=await toggleBot(id)
          if(req.status==="success"){
              Swal.fire({
                toast: true,
                position: "top-end", // Position to bottom-right
                icon: "success",
                title: "Bot has Been enabled!",
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
                background: "#343a40", // Dark theme
                color: "#fff", // White text
                
              });
            await fetchData()
          }
          
      }

  })
  }
  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "agent name" },
    { accessorKey: "description", header: "description" },
    {
      header: "Actions",
      id: "actions", // Unique ID for this column
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            outline={true}
            variant="secondary"
            onClick={()=>{
              setShowEdit(true)
              setEditId(row.original.id)
            }}
            className="px-3 py-1"
          >
            <Edit size={16} />
            <span className="ml-2">Edit</span>
          </Button>
          <Button
          outline={true}
          variant="danger"
            onClick={()=>{
              setShowAdd(true)
            }}
            className="px-3 py-1"
          >
            <Trash size={16} />
            <span className="ml-2">Delete</span>
          </Button>
          {
            row.original.enable
            ?
            <Button
              outline={true}
              variant="danger"
                onClick={()=>{
                  handleToggleBot(row.original.id,row.original.enable)
                }}
                className="px-3 py-1"
              >
                <BotOff size={16} />
                <span className="ml-2">Disable Bot</span>
            </Button>
            :
            <Button
              outline={true}
              variant="success"
                onClick={()=>{
                  handleToggleBot(row.original.id,row.original.enable)
                }}
                className="px-3 py-1"
              >
                <BotIcon size={16} />
                <span className="ml-2">Enable Bot</span>
            </Button>
          }
        </div>
      ),
    },
  ];
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
  const fetchData = async () => {
    setLoading(true)
    const result = await getAll(pagination.pageIndex, pagination.pageSize, globalFilter);
    setData(result.data);
    setTotalCount(result.metadata.totalCount);

    // Calculate total pages based on the new totalCount
    const totalPages = Math.ceil(result.metadata.totalCount / pagination.pageSize);
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
    setLoading(false)
  };
  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  

  return (
    <>
      <ModalAdd onSubmit={async()=>{await fetchData()}} show={showAdd} setShow={setShowAdd}/>
      <div className="p-6 w-full max-w-4xl mx-auto shadow-xl bg-gray-800 rounded-md">
       <Button
          onClick={()=>{
            setShowAdd(true)
          }}
          outline={true}
          className="px-3 py-1 mb-4"
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
              {
                loading
                ?
                <tr>
                  <td colSpan={columns.length}>
                    <Loading/>
                  </td>
                </tr>
                :
                <>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-gray-700">
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
                </>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 border rounded-md flex items-center gap-1"
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
            className="px-3 py-2 border rounded-md flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}