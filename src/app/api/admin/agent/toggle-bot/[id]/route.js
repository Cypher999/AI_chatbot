import { getOne,update } from "@/utils/db/agent"
export async function PUT(req,{params}) {
  try {
    let {id}=params;
    id=parseInt(id)
    const oldData=await getOne({
      where:{id}
    })
    if(!oldData) return Response.json({ status:'error',message:'data not found' }, { status: 404 })
    await update({
      enable:!oldData.enable
    },{id})
    return Response.json({ status:'success',message:`bot has been ${oldData.enable ? "disabled":"enabled"}`, }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}