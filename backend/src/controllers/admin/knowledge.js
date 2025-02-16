const agentUtils=__require('utils/db/agent')
const knowledgeUtils=__require('utils/db/knowledge')
const joi=require('joi')
const validator = joi.object({
    label: joi.string()
        .required()
        .messages({
        'any.required': 'label is required'
        }),
    content: joi.string()
        .required()
        .messages({
        'any.required': 'content is required'
        })
});
const index=async(req,res)=>{
    const agentId=parseInt(req.params.agentId);
    const agentData=await agentUtils.getOne({id:agentId});
    if (agentData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const data=await knowledgeUtils.getMany({agentId});
    return res.status(200).json({status:'success',data})
}

const getOne=async(req,res)=>{
    const id=parseInt(req.params.id);
    const agentId=parseInt(req.params.agentId);
    const data=await knowledgeUtils.getOne({id,agentId});
    if (data==null) return res.status(404).json({status:'error',
        message:"knowledge type not found"})
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
    const agentId=parseInt(req.params.agentId);
    const agentData=await agentUtils.getOne({id:agentId});
    if (agentData==null) return res.status(404).json({status:'error',
        message:"AI agent not found"})
    const checkName=await knowledgeUtils.count({agentId,label:req.body.label});
    if(checkName>0) return res.status(500).json({status:'error',message:"name already used"})
    const result=await knowledgeUtils.add({
        agentId:agentId,
        label:req.body.label,
        content:req.body.content
    })
    if(!result) return res.status(500).json({status:'error',message:"error when saving data"})
    return res.status(200).json({status:'success',message:"data has been saved",data:result.id})
}

const update=async(req,res)=>{
    const agentId=parseInt(req.params.agentId);
    const id=parseInt(req.params.id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const oldData=await knowledgeUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"knowledge not found"})
    const checkName=await knowledgeUtils.count({agentId,label:req.body.label});
    if(checkName>0&&oldData.label!=req.body.label) return res.status(500).json({status:'error',
        message:"label already used"})
    const result=await knowledgeUtils.update({
        label:req.body.label,
        content:req.body.content
    },{id})
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const del=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await knowledgeUtils.getOne({id});
    if (oldData==null) return res.status(404).json({status:'error',
        message:"knowledge not found"})
    const result=await knowledgeUtils.del({id})
    if(!result) return res.status(500).json({status:'error',message:"error when deleting data"})
    return res.status(200).json({status:'success',message:"data has been deleted",data:result.id})
}

module.exports={index,getOne,create,update,del}