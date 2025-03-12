import { count,add, getOne, update, remove } from "@/utils/db/agent"
import { getToken } from "next-auth/jwt";
import Joi from "joi";
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  context: Joi.string().min(5).required(),
  description: Joi.string().optional(),
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
    let {id}=await params;
    id=parseInt(id)
  let formData=await req.formData();
  formData = {
    name: formData.get("name"),
    context: formData.get("context"),
    description: formData.get("description") || "",
  };
  const { error } = schema.validate(formData,{ abortEarly: false });
  if (error) {
    const validationErrors = error.details.reduce((acc, detail) => {
      const key = detail.path[0]; // Get the field name
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
      name:formData.name
    }
  })
  if(checkData>0&&oldData.name!=formData.name) return Response.json({status:"error",message:'data already exists'},{status:500})
  const newData=await update(
    formData,{id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'AI Agent has been updated',newData},{status:200})
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
  return Response.json({status:"success",message:'AI Agent has been updated',newData},{status:200})
}