import { getAll,count,add } from "@/utils/db/knowledge";
import { getOne as  getOneAgent,count as countAgent} from "@/utils/db/agent";
const { GoogleGenerativeAI } = require("@google/generative-ai");

import Joi from "joi";
const schema = Joi.object({
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
              { content: { contains: filter } },
          ],
        },
    });
    const data=await getAll({where: {
        agentId,
          OR: [
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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "models/embedding-001" });
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
  const embeddingResponse = await model.embedContent({
    content: { parts: [{ text: formData.content }] }
  });
  formData.embedding = embeddingResponse.embedding.values; 
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