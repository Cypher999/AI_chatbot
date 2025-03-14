import { getAll,count,add } from "@/utils/db/users"
import { getToken } from "next-auth/jwt";
import Joi from "joi";
import { randomBytes } from "crypto";
import { writeFile } from "fs";
import { hash } from "bcrypt";
import path from "path"
export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "ai-chatbot-token", 
  });
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 0;
    const size = searchParams.get("size") || 5; 
    const filter = searchParams.get("filter") || ""; 

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);
    const totalCount = await count({
        where: {
          id:{
            not:token.id
          },
        OR: [
            { username: { contains: filter } },
        
        ],
        },
    });
    const data=await getAll({
        where: {
          id:{
            not:token.id
          },
        OR: [
            { username: { contains: filter } },
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
  const photoFile=await formData.get('photo');
  const buffer = formData.get('photo') ?  Buffer.from(await photoFile.arrayBuffer()):0;
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).required(),
    confirm: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
        'any.only':'password must match with confirm',
        'any.required': 'confirm is required',
        }),
    role: Joi.string()
        .required()
        .messages({
        'any.required': 'role is required',
        }),
  });
  formData = {
    username: formData.get("username"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    role: formData.get("role"),
  };
  const { error } = schema.validate(formData,{ abortEarly: false });
  if (error) {
    const validationErrors = error.details.reduce((acc, detail) => {
      const key = detail.path[0]; // Get the field username
      if (!acc[key]) {
        acc[key] = []; // Initialize as an array if not exists
      }
      acc[key].push(detail.message); // Push the error message
      return acc;
    }, {});
  
    return Response.json({ status:"validation error",message:"data incomplete",data: validationErrors }, { status: 500 });
  }
  const allowedTypes=["image/jpeg","image/jpg","image.png"];
  const checkData=await count({
    where:{
      username:formData.username
    }
  })
  if(checkData>0) return Response.json({status:"error",message:'data already exists'},{status:500})
  formData['password']= await hash(formData['password'], 10);
  delete(formData['confirm'])
  if(photoFile) {
    if(allowedTypes.indexOf(photoFile.type)==-1){
      return Response.json({ status:"validation error",message:"data incomplete",data: {photo:['invalid filetype, only image are allowed']} }, { status: 500 });
    }
    if(photoFile.size>10240000){
      return Response.json({ status:"validation error",message:"data incomplete",data: {photo:['max size is 10 mb']} }, { status: 500 });
    }
    formData['photo']=randomBytes(10).toString("hex").slice(0,10)+"."+photoFile.type.split("/")[1]
    
    await writeFile(
      path.join(process.cwd(), "public/image/user/" + formData['photo']),
      buffer,{},function(){
        return;
      })
  }
  
  const newData=await add({
    ...formData
  });
  if(!newData) return Response.json({status:"error",message:'error when saving data'},{status:500})
    
      
  return Response.json({status:"success",message:'User has been saved',newData},{status:200})
}