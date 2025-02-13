const agentUtils=__require('utils/db/agent')
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
    const data=await agentUtils.getAll();
    return res.status(200).json({status:'success',data})
}

const getOne=async(req,res)=>{
    const id=parseInt(req.params.id);
    const data=await agentUtils.getOne(id);
    if (data==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
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
    const checkName=await agentUtils.countName(req.body.name);
    if(checkName>0) return res.status(500).json({status:'error',message:"name already used"})
    const result=await agentUtils.add({
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
    const oldData=await agentUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const checkName=await agentUtils.countName(req.body.name);
    if(checkName>0&&oldData.name!=req.body.name) return res.status(500).json({status:'error',
        message:"name already used"})
    const result=await agentUtils.update({
        name:req.body.name,
        context:req.body.context,
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const enableBot=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await agentUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const result=await agentUtils.update({
        enable:true
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"bot has been enabled",data:result.id})
}

const disableBot=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await agentUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const result=await agentUtils.update({
        enable:false
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"bot has been disabled",data:result.id})
}

const del=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await agentUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const result=await agentUtils.del(id)
    if(!result) return res.status(500).json({status:'error',message:"error when deleting data"})
    return res.status(200).json({status:'success',message:"data has been deleted",data:result.id})
}

module.exports={index,getOne,create,update,del,enableBot,disableBot}