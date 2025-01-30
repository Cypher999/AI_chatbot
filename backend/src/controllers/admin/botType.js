const botTypeUtils=__require('utils/db/botType')
const joi=require('joi')
const validator = joi.object({
    name: joi.string()
        .required()
        .messages({
        'any.required': 'name is required'
        }),
    context: joi.string()
        .required()
        .messages({
        'any.required': 'context is required'
        })
});
const index=async(req,res)=>{
    const data=await botTypeUtils.getAll();
    return res.status(200).json({status:'success',data})
}

const getOne=async(req,res)=>{
    const id=parseInt(req.params.id);
    const data=await botTypeUtils.getOne(id);
    if (data==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    return res.status(200).json({status:'success',data})
}

const create=async(req,res)=>{
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const checkName=await botTypeUtils.countName(req.body.name);
    if(checkName>0) return res.status(500).json({status:'error',message:"name already used"})
    const result=await botTypeUtils.add({
        userId:req.user_id,
        name:req.body.name,
        context:req.body.context,
        enable:true
    })
    if(!result) return res.status(500).json({status:'error',message:"error when saving data"})
    return res.status(200).json({status:'success',message:"data has been saved",data:result.id})
}

const update=async(req,res)=>{
    const id=parseInt(req.params.id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const oldData=await botTypeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const checkName=await botTypeUtils.countName(req.body.name);
    if(checkName>0&&oldData.name!=req.body.name) return res.status(500).json({status:'error',
        message:"name already used"})
    const result=await botTypeUtils.update({
        name:req.body.name,
        context:req.body.context,
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const enableBot=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await botTypeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const result=await botTypeUtils.update({
        enable:true
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"bot has been enabled",data:result.id})
}

const disableBot=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await botTypeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const result=await botTypeUtils.update({
        enable:false
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"bot has been disabled",data:result.id})
}

const del=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await botTypeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const result=await botTypeUtils.del(id)
    if(!result) return res.status(500).json({status:'error',message:"error when deleting data"})
    return res.status(200).json({status:'success',message:"data has been deleted",data:result.id})
}

module.exports={index,getOne,create,update,del,enableBot,disableBot}