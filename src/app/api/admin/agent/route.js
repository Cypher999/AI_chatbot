import { getAll,count,add,getOn } from "@/utils/db/agent"
import { getToken } from "next-auth/jwt";
import Joi from "joi";
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  context: Joi.string().min(5).required(),
  description: Joi.string().optional(),
});
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 0;
    const size = searchParams.get("size") || 5; 
    const filter = searchParams.get("filter") || ""; 

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);
    const totalCount = await count({
        where: {
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
            {user: {
                 username: { contains: filter } 
              },
        }
        ],
        },
    });
    const data=await getAll({
        where: {
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
            {user: {
                 username: { contains: filter } 
              },
        }
        ],
        },
        skip: pageIndex * pageSize,
        take: pageSize,
    });
    const totalPage=Math.ceil(totalCount/size)
    return Response.json({ data,totalCount,totalPage,page }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Encountered an error" }, { status: 500 })
  }
}

export async function POST(req){
  const data=await req.formData();
  const formData = {
    name: data.get("name"),
    context: data.get("context"),
    description: data.get("description") || "",
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
  
    return Response.json({ validation_error: validationErrors }, { status: 500 });
  }
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "ai-chatbot-token", 
  });
  console.log(token)
  const checkData=await count({
    where:{
      name:data.get('name')
    }
  })
  if(checkData>0) return Response.json({error:'data already exists'},{status:500})
  const newData=await add({
    name:data.get('name'),
    context:data.get('context'),
    description:data.get('description'),
    enable:false,
    user:{
      connect:{
        id:token.id
      }
    }
  });
  if(!newData) return Response.json({error:'error when saving data'},{status:500})
  return Response.json({message:'AI Agent has been saved',newData},{status:200})
}