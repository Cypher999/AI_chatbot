const userUtils=__require('utils/db/users')
const {verify,hash}=__require('utils/hashPassword')
const generateRandom=__require('utils/generateRandom')
const joi=require('joi')
const {existsSync,unlinkSync}=require('fs')
const path=require('path')
const index=async(req,res)=>{
    const id=parseInt(req.user_id);
    const data=await userUtils.getOne({id});
    if (data==null) return res.status(404).json({status:'error',
        message:"users not found"})
    data.password=null
    if(existsSync(process.cwd()+'/img/user/'+data.photo)){
        data._photo=__base_url('/img-user/'+data.photo)
    }
    return res.status(200).json({status:'success',data})
}

const updateData=async(req,res)=>{
    const validator = joi.object({
        username: joi.string()
            .required()
            .messages({
            'any.required': 'username is required'
            }),
    });
    const id=parseInt(req.user_id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    
    const oldData=await userUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"user not found"})
    const checkName=await userUtils.count({username:req.body.username});
    if(checkName>0&&oldData.username!=req.body.username) return res.status(500).json({
        status:'error',
        message:"name already used"})
    if(req.files.photo!==undefined){
        if(req.files.photo.size/1000>5200){
            return res.status(500).json({ code:500,status:"error",message: 'max filesize is 5 Mb' });
        }
        if(req.files.photo.mimetype.split("/")[0] != 'image'){
            return res.status(500).json({ code:500,status:"error",message: 'file must be an image' });
        }
    }
    const filename=generateRandom(10);
    
    const result=await userUtils.update({
        username:req.body.username,
        role:req.body.role,
        photo:req.files.img!==undefined?filename+".jpg":"man.jpg",
    },{id})
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    if(req.files.photo!==undefined){
        if(oldData.photo!="man.jpg"){
            unlinkSync(path.join(process.cwd(),'/img/user',oldData.photo))
        }
        await uploads(req.files.photo, "./img/user/" + filename );
    }
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const updatePassword=async(req,res)=>{
    const validator = joi.object({
        old: joi.string()
            .required()
            .messages({
            'any.required': 'old password is required',
            }),
        new: joi.string()
            .min(8)
            .required()
            .messages({
            'any.required': 'new password is required',
            'any.min':'new password must more than 8 character'
            }),
        confirm: joi.string()
            .valid(joi.ref('new'))
            .required()
            .messages({
            'any.only':'confirm password must match with new password',
            'any.required': 'confirm is required',
            }),
    });
    const id=parseInt(req.user_id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    
    const oldData=await userUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"user not found"})
    if (await verify(req.body.old,oldData.password)==false) return res.status(500).json({status:'error',
            message:"old password not match"})
    const result=await userUtils.update({
        password:await hash(req.body.new)
    },{id})
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

module.exports={index,updateData,updatePassword}