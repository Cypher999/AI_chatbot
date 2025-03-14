import { count, getOne, update, remove } from "@/utils/db/users"
import Joi from "joi";
import {writeFile,existsSync, unlinkSync} from "fs"
import path from "path";
export async function GET(req,{params}) {
  try {
    let id=parseInt((await params).id);
    id=parseInt(id)
    const data=await getOne({
        where: {
            id
        },
    });
    if(!data) return Response.json({ status:'error',message:'data not found' }, { status: 404 })
    return Response.json({ status:'success',data }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}

export async function DELETE(req,{params}){
    let id=parseInt((await params).id);
  const checkData=await getOne({
    where:{
      id
    }
  })
  if(!checkData) return Response.json({status:"error",message:'data not found'},{status:404})
    if(checkData.photo!='man.jpg'){
      const checkFileExists=existsSync(path.join(process.cwd(), "public/image/user/" + checkData.photo))
      if(checkFileExists){
        await unlinkSync(
          path.join(process.cwd(), "public/image/user/" + checkData.photo)
        )
      }
    }
  const newData=await remove(
    {id});
  if(!newData) return Response.json({status:"error",message:'error when deleting data'},{status:500})
  return Response.json({status:"success",message:'User has been deleted'},{status:200})
}