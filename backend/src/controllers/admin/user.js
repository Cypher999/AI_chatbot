const userUtils=__require('utils/db/users')
const {verify,hash}=__require('utils/hashPassword')
const generateRandom=__require('utils/generateRandom')
const {unlinkSync, existsSync}=require('fs');
const joi=require('joi')
const uploads=__require('utils/uploads')
const path=require('path')
const index=async(req,res)=>{
    const data=await userUtils.getMany();
    return res.status(200).json({status:'success',data})
}

const getOne=async(req,res)=>{
    const id=parseInt(req.params.id);
    const data=await userUtils.getOne({id});
    if (data==null) return res.status(404).json({status:'error',
        message:"users not found"})
    return res.status(200).json({status:'success',data})
}

const create=async(req,res)=>{
    const validator = joi.object({
        username: joi.string()
            .required()
            .messages({
            'any.required': 'username is required'
            }),
        password: joi.string()
            .min(8)
            .required()
            .messages({
            'any.required': 'password is required',
            'any.min':'password must more than 8 character'
            }),
        confirm: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({
            'any.only':'password must match with confirm',
            'any.required': 'confirm is required',
            }),
        role: joi.string()
            .required()
            .messages({
            'any.required': 'role is required',
            }),
        
    });
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    if(["admin","user"].indexOf(req.body.role)<=-1) return res.status(500).json({status:'error',message:"role must be user or admin"})
    const checkName=await userUtils.count({username:req.body.username})
    if(checkName>0) return res.status(500).json({status:'error',message:"name already used"})
    if(req.files.photo!==undefined){
        if(req.files.photo.size/1000>5200){
            return res.status(500).json({ code:500,status:"error",message: 'max filesize is 5 Mb' });
        }
        if(req.files.photo.mimetype.split("/")[0] != 'image'){
            return res.status(500).json({ code:500,status:"error",message: 'file must be an image' });
        }
    }
    const filename=generateRandom(10);
    const result=await userUtils.add({
        username:req.body.username,
        password:await hash(req.body.password),
        photo:req.files.photo!==undefined?filename+".jpg":"man.jpg",
        role:req.body.role
    })
    if(!result) return res.status(500).json({status:'error',message:"error when saving data"})
    if(req.files.photo!==undefined){
        await uploads(req.files.photo, "./img/user/" + filename + ".jpg");
    }
    return res.status(200).json({status:'success',message:"data has been saved",data:result.id})
}

const updateData=async(req,res)=>{
    const validator = joi.object({
        username: joi.string()
            .required()
            .messages({
            'any.required': 'username is required'
            }),
        role: joi.string()
            .required()
            .messages({
            'any.required': 'role is required',
            }),
    });
    const id=parseInt(req.params.id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    
    const oldData=await userUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"user not found"})
    const checkName=await userUtils.count({username:req.body.username});
    if(checkName>0&&oldData.username!=req.body.username) return res.status(500).json({status:'error',
        message:"name already used"})
    if(req.files.photo!==undefined){
        if(req.files.photo.size/1000>5200){
            return res.status(500).json({ code:500,status:"error",message: 'max filesize is 5 Mb' });
        }
        if(req.files.photo.mimetype.split("/")[0] != 'image'){
            return res.status(500).json({ code:500,status:"error",message: 'file must be an image' });
        }
    }
    console.log(req.files)
    if(["admin","user"].indexOf(req.body.role)<=-1) return res.status(500).json({status:'error',message:"role must be user or admin"})
    const filename=generateRandom(10);
    
    const result=await userUtils.update({
        username:req.body.username,
        role:req.body.role,
        photo:req.files.photo!==undefined?filename+".jpg":oldData.photo,
    },{id})
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    if(req.files.photo!==undefined){
        if(oldData.photo!="man.jpg"){
            if(existsSync(process.cwd()+'/img/user/'+oldData.photo)){
                unlinkSync(path.join(process.cwd(),'/img/user',oldData.photo))
            }
        }
        await uploads(req.files.photo, "./img/user/" + filename + ".jpg");
    }
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const updatePassword=async(req,res)=>{
    const validator = joi.object({
        password: joi.string()
            .required()
            .messages({
            'any.required': 'password is required',
            }),
        confirm: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({
            'any.only':'password must match with confirm',
            'any.required': 'confirm is required',
            }),
    });
    const id=parseInt(req.params.id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    
    const oldData=await userUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"user not found"})
    const result=await userUtils.update({
        password:await hash(req.body.password)
    },{id})
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const del=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await userUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"user not found"})
    const result=await userUtils.del({id})
    if(!result) return res.status(500).json({status:'error',message:"error when deleting data"})
    if(oldData.photo!="man.jpg") unlinkSync(path.join(process.cwd(),'/img/user',oldData.photo))
    return res.status(200).json({status:'success',message:"data has been deleted",data:result.id})
}

module.exports={index,getOne,create,updateData,updatePassword,del}