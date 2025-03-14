"use client";

import { useEffect, useState } from "react";
import {  ArrowLeftCircle, Plus } from "lucide-react";
import { getOne as getOneAgent } from "@/utils/services/admin/agent";
import { getAll, remove } from "@/utils/services/admin/knowledge";
import Button from "@/components/ui/button";
import ModalAdd from "./modalAdd";
import Swal from "sweetalert2";
import Loading from "@/components/shared/loading";
import ModalEdit from "./modalEdit";
import FilterTable from "@/components/shared/filterTable";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { BodyRow, Head, NoData, TLoading } from "./tableData";
import Options from "./options";
import TablePagination from "@/components/shared/tablePagination";
export default function Knowledge({agentId}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [data, setData] = useState([]); 
  const [agentData, setAgentData] = useState({
    name:""
  }); 
  const [maxPage,setMaxPage]=useState(0)
  const [totalCount,setTotalCount]=useState(0)
  const [minPage,setMinPage]=useState(0)
  const handleDelete=async function(id){
    Swal.fire({
      title: 'Confirm Delete',
      text: `delete  knowledge with id ${id}?`,
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
          const req=await remove(agentId,id)
          if(req.status==="success"){
              Swal.fire({
                toast: true,
                position: "top-end", // Position to bottom-right
                icon: "success",
                title: "Knowledge has Been deleted!",
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
                background: "#343a40", // Dark theme
                color: "#fff", // White text
                
              });
            fetchData();
          }
          
      }

  })
  }
  const handleEdit=function(id){
    setShowEdit(true)
    setEditId(id)
  }
  const fetchData = async () => {
    setLoading(true)
    const resultAgent = await getOneAgent(agentId);
    if(resultAgent.status==="error"){
      Swal.fire({
        title: 'Error',
        text: resultAgent.message,
        icon:'error',
        background: "var(--color-gray-800)",
        color: "#fff",
        showCancelButton: false,
     })
     window.history.go(-1)
     return ;
    }
    setTimeout(()=>{
      setAgentData(resultAgent.data)
    },3000)
    const result = await getAll(agentId,pagination.pageIndex, pagination.pageSize, globalFilter);
    if(result.data.length==0&&pagination.pageIndex>0){
      setPagination(n=>({
        ...n,
        ['pageIndex']:n.pageIndex-1
      }))
    }
    setAgentData(result.agentData)
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
  }, [pagination.pageIndex,pagination.pageSize,globalFilter]);

  

  return (
    <>
      <ModalAdd agentId={agentId} onSubmit={async()=>{await fetchData()}} show={showAdd} setShow={setShowAdd}/>
      <ModalEdit agentId={agentId} onSubmit={async()=>{await fetchData()}} show={showEdit} setShow={setShowEdit} id={editId}/>
      <div className="p-6 w-full  shadow-xl bg-gray-800 rounded-md">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-gray-100">Knowledge list of {agentData?.name}</h2>
        </div>
        <div className="flex mb-4 items-center">
          <Button
            onClick={()=>{
              window.history.go(-1)
            }}
            outline={true}
            variant="warning"
            className="px-3 py-1 mr-4"
          >
            <ArrowLeftCircle size={16} />
            <span className="ml-2">Back</span>
          </Button>
        <Button
            onClick={()=>{
              setShowAdd(true)
            }}
            outline={true}
            className="px-3 py-1"
          >
            <Plus size={16} />
            <span className="ml-2">Add Knowledge</span>
          </Button>
        </div>
        
        <FilterTable
          onInputChange={(e) => setGlobalFilter(e.target.value)}
          inputValue={globalFilter}
          sizeValue={pagination.pageSize}
          onSizeChange={(e) => setPagination((n) => ({ ...n,pageSize: Number(e.target.value) }))}
        />
        <div className="overflow-x-auto">
          <Table>
            <Head/>
            <TBody>
              {
                loading
                ?
                <TLoading/>
                :
                <>
                  {data.length>0 ? (
                      data.map((item,index) => (
                        <BodyRow
                          key={index}
                          index={index}
                          pagination={pagination}
                          item={item}
                          options={
                            <Options
                              item={item}
                              onEdit={()=>{
                                handleEdit(item.id)
                              }}
                              onDelete={()=>{
                                handleDelete(item.id)
                              }}
                            />
                          }
                        />
                      ))
                    ) : (
                      <NoData/>
                    )}
                </>
              }
            </TBody>
          </Table>
        </div>
        <TablePagination
          pagination={pagination}
          minPage={minPage}
          maxPage={maxPage}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}