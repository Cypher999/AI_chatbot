import { count, update } from "@/utils/db/users"
import Joi from "joi";
import { hash } from "bcrypt";

export async function PUT(req,{params}){
    let id=parseInt((await params).id);
  let formData=await req.formData();
  const schema = Joi.object({
      password: Joi.string().min(3).required(),
      confirm: Joi.string()
          .valid(Joi.ref('password'))
          .required()
          .messages({
          'any.only':'password must match with confirm',
          'any.required': 'confirm is required',
          })
    });
    formData = {
      password: formData.get("password"),
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
  const oldData=await count({
    where: {
        id
    },
    });
  console.log(formData)
  if(oldData<=0) return Response.json({ status:'error',message:'data not found' }, { status: 404 })
  formData['password']= await hash(formData['password'], 10);
  delete(formData['confirm'])
    const newData=await update(
    formData,{id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'Password has been updated',newData},{status:200})
}

