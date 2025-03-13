import { getAll,count,add } from "@/utils/db/knowledge";
import { getOne as  getOneAgent,count as countAgent} from "@/utils/db/agent";
import { getToken } from "next-auth/jwt";
import Joi from "joi";
const schema = Joi.object({
  label: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).required(),
});
export async function GET(req,{params}) {
  const agentId=parseInt((await params).agentId);
  const agentData=await countAgent({
    where:{
      id:agentId
    }
  })
  if(agentData<=0) return Response.json({ status:'error',message:'Agent ID not found' }, { status: 404 })
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 0;
    const size = searchParams.get("size") || 5; 
    const filter = searchParams.get("filter") || ""; 

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);
    const totalCount = await count({
        where: {
          agentId,
          OR: [
              { label: { contains: filter } },
              { content: { contains: filter } },
          ],
        },
    });
    const data=await getAll({where: {
        agentId,
          OR: [
              { label: { contains: filter } },
              { content: { contains: filter } },
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

export async function POST(req,{params}){
  const agentId=parseInt((await params).agentId);
  console.log("agent id is ")
  console.log(agentId)
  const checkAgent=await countAgent({
    where:{
      id:agentId
    }
  })
  if(checkAgent<=0) return Response.json({ status:'error',message:'Agent ID not found' }, { status: 404 })
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
  const checkData=await count({
    where:{
      label:formData.label,
      agentId
    }
  })
  if(checkData>0) return Response.json({status:"error",message:'data already exists'},{status:500})
  const newData=await add({
    ...formData,
    agent:{
      connect:{
        id:agentId
      }
    }
  });
  if(!newData) return Response.json({status:"error",message:'error when saving data'},{status:500})
  return Response.json({status:"success",message:'knowledge has been saved',newData},{status:200})
}