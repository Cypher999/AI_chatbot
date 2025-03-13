import { count,add, getOne, update, remove } from "@/utils/db/knowledge"
import Joi from "joi";
const schema = Joi.object({
  label: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(5).required(),
});
export async function GET(req,{params}) {
  try {
    let {id}=await params;
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

export async function PUT(req,{params}){
  const {id}=parseInt((await params).id);
  const {agentId}=parseInt((await params).agentId);
  let formData=await req.formData();
  formData = {
    label: formData.get("label"),
    content: formData.get("content"),
  };
  const { error } = schema.validate(formData,{ abortEarly: false });
  if (error) {
    const validationErrors = error.details.reduce((acc, detail) => {
      const key = detail.path[0]; // Get the field label
      if (!acc[key]) {
        acc[key] = []; // Initialize as an array if not exists
      }
      acc[key].push(detail.message); // Push the error message
      return acc;
    }, {});
  
    return Response.json({ status:"validation error",message:"data incomplete",data: validationErrors }, { status: 500 });
  }
  const oldData=await getOne({
    where: {
        id
    },
    });
  if(!oldData) return Response.json({ status:'error',message:'data not found' }, { status: 404 })
  const checkData=await count({
    where:{
      label:formData.label,
      agentId
    }
  })
  if(checkData>0&&oldData.label!=formData.label) return Response.json({status:"error",message:'data already exists'},{status:500})
  const newData=await update(
    formData,{id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'knowledge has been updated',newData},{status:200})
}

export async function DELETE(req,{params}){
    let {id}=await params;
    id=parseInt(id)
  const checkData=await count({
    where:{
      id
    }
  })
  if(checkData<0) return Response.json({status:"error",message:'data not found'},{status:404})
  const newData=await remove(
    {id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'knowledge has been deleted'},{status:200})
}