import { getOne,update } from "@/utils/db/agent"
import getToken  from "@/utils/getToken";
export async function PUT(req,{params}) {
  const token = await getToken(req);
  try {
    let id=parseInt((await params).id);
    const oldData=await getOne({
      where:{id,userId:token.id}
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