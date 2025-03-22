import { count, getOne, update } from "@/utils/db/users"
import Joi from "joi";
import { randomBytes } from "crypto";
import {writeFile,existsSync, unlinkSync} from "fs"
import path from "path";
import getToken  from "@/utils/getToken";
export async function PUT(req,{params}){
    const token = await getToken(req);
      const id=token.id
    const allowedTypes=["image/jpeg","image/jpg","image.png"];
  let formData=await req.formData();
  const photoFile=await formData.get('photo');
    const buffer = formData.get('photo') ?  Buffer.from(await photoFile.arrayBuffer()):0;
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
    });
    formData = {
      username: formData.get("username")
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
      username:formData.username
    }
  })
  if(checkData>0&&oldData.username!=formData.username) return Response.json({status:"error",message:'data already exists'},{status:500})
  if(photoFile) {
      if(oldData.photo!='man.jpg'){
        const checkFileExists=existsSync(path.join(process.cwd(), "public/image/user/" + oldData.photo))
        if(checkFileExists){
          await unlinkSync(
            path.join(process.cwd(), "public/image/user/" + oldData.photo)
          )
        }
      }
      if(allowedTypes.indexOf(photoFile.type)==-1){
        return Response.json({ status:"validation error",message:"data incomplete",data: {photo:['invalid filetype, only image are allowed']} }, { status: 500 });
      }
      if(photoFile.size>10240000){
        return Response.json({ status:"validation error",message:"data incomplete",data: {photo:['max size is 10 mb']} }, { status: 500 });
      }
      formData['photo']=randomBytes(10).toString("hex").slice(0,10)+"."+photoFile.type.split("/")[1]
      
      await writeFile(
        // path.join(__dirname, "public/uploads/" + filename),
        path.join(process.cwd(), "public/image/user/" + formData['photo']),
        buffer,{},function(){
          return;
        })
    }
    const newData=await update(
    formData,{id});
  if(!newData) return Response.json({status:"error",message:'error when updating data'},{status:500})
  return Response.json({status:"success",message:'User has been updated',newData},{status:200})
}
