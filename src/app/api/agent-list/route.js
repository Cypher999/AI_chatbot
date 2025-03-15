import { getAll } from "@/utils/db/agent";

export async function GET(req) {
  try {
    const data = await getAll({
        where:{
            enable:true
        }
    })
    return Response.json({ 
        status:"success",
        data
     }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}