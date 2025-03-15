import { getOne, update } from "@/utils/db/users"
import Joi from "joi";
import { hash,compare } from "bcrypt";

import { getToken } from "next-auth/jwt";
export async function PUT(req,{params}){
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: "ai-chatbot-token", 
      });
      const id=token.id
  let formData=await req.formData();
  const schema = Joi.object({
      old: Joi.string().min(3).required(),
      new: Joi.string().min(3).required(),
      confirm: Joi.string()
          .valid(Joi.ref('new'))
          .required()
          .messages({
          'any.only':'new new must match with confirm',
          'any.required': 'confirm is required',
          })
    });
    formData = {
      new: formData.get("new"),
      old: formData.get("old"),
      confirm: formData.get("confirm"),
    };
  const { error } = schema.validate(formData,{ abortEarly: false });
  if (error) {
    const validationErrors = error.details.reduce((acc, detail) => {
      const key = detail.path[0]; 
      if (!acc[key]) {
        acc[key] = []; 
      }
      acc[key].push(detail.message);
      return acc;
    }, {});
  
    return Response.json({ status:"validation error",message:"data incomplete",data: validationErrors }, { status: 500 });
  }
  const oldData=await getOne({
    where: {
        id
    },
    });
  if(oldData<=0) return Response.json({ status:'error',message:'data not found' }, { status: 404 })
  const isValid = await compare(formData['old'],oldData.password)
  if(!isValid) return Response.json({ status:"validation error",message:"data incomplete",data: {old:['old password doesnt match']} }, { status: 500 });
  formData['password']= await hash(formData['new'], 10);
  delete(formData['old'])
  delete(formData['confirm'])
  delete(formData['new'])
    const newData=await update(
    formData,{id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'Password has been updated',newData},{status:200})
}

