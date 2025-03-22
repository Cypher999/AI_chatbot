import { getAll,count,add } from "@/utils/db/agent"
import getToken  from "@/utils/getToken";

import Joi from "joi";
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  context: Joi.string().min(3).required(),
  description: Joi.string().min(3).optional(),
});
export async function GET(req) {
  const token = await getToken(req);
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 0;
    const size = searchParams.get("size") || 5; 
    const filter = searchParams.get("filter") || ""; 

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);
    const totalCount = await count({
        where: {
          userId:token.id,
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
        ],
        },
    });
    const data=await getAll({
        where: {
          userId:token.id,
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
        ],
        },
        skip: pageIndex * pageSize,
        take: pageSize,
    });
    const totalPage=Math.ceil(totalCount/size)
    return Response.json({ status:'success',data,metadata:{totalCount,totalPage,page} }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ status:"error",message: "Encountered an error" }, { status: 500 })
  }
}

export async function POST(req){
  let formData=await req.formData();
  formData = {
    name: formData.get("name"),
    context: formData.get("context"),
    description: formData.get("description") || "",
  };
  const { error } = schema.validate(formData,{ abortEarly: false });
  formData['enable']=false;
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
  const token = await getToken(req);
  
  const checkData=await count({
    where:{
      name:formData.name
    }
  })
  if(checkData>0) return Response.json({status:"error",message:'data already exists'},{status:500})
  const newData=await add({
    ...formData,
    user:{
      connect:{
        id:token.id
      }
    }
  });
  if(!newData) return Response.json({status:"error",message:'error when saving data'},{status:500})
  return Response.json({status:"success",message:'AI Agent has been saved',newData},{status:200})
}