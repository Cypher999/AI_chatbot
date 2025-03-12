"use client"
import { Users, BotIcon, ListCheck, } from "lucide-react";
import { useState,useEffect } from "react";
import { getAll } from "@/utils/services/admin/dashboard";
import Loading from "@/components/shared/loading";
export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    agent:0,
    user:0,
    knowledge:0
  }); 
  const fetchData = async () => {
      setLoading(true)
      const result = await getAll();
      setData(result.data);
      setLoading(false)
    };
    useEffect(() => {
      fetchData();
    }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {
        loading
        ?
        <Loading/>
        :
        <>
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 border-b">Agent</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BotIcon size={60} className="text-white" />
              </div>
              <p className="text-xl font-bold text-white">{data.agent}</p>
            </div>
            <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
              Detail
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 border-b">Knowledge</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ListCheck size={60} className="text-white" />
              </div>
              <p className="text-xl font-bold text-white">{data.knowledge}</p>
            </div>
            <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
              Detail
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 border-b">User</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users size={60} className="text-white" />
              </div>
              <p className="text-xl font-bold text-white">{data.user}</p>
            </div>
            <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
              Detail
            </button>
          </div>
        </>
      }
    </div>
    
  );
}
