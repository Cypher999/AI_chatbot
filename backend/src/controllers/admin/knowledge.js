const botTypeUtils=__require('utils/db/botType')
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
    const botTypeId=parseInt(req.params.botTypeId);
    const botTypeData=await botTypeUtils.getOne(botTypeId);
    if (botTypeData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const data=await knowledgeUtils.getBotId(botTypeId);
    return res.status(200).json({status:'success',data})
}

const getOne=async(req,res)=>{
    const id=parseInt(req.params.id);
    const data=await knowledgeUtils.getOne(id);
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
    const botTypeId=parseInt(req.params.botTypeId);
    const botTypeData=await botTypeUtils.getOne(botTypeId);
    if (botTypeData==null) return res.status(404).json({status:'error',
        message:"bot type not found"})
    const checkName=await knowledgeUtils.countLabel(botTypeId,req.body.label);
    if(checkName>0) return res.status(500).json({status:'error',message:"name already used"})
    const result=await knowledgeUtils.add({
        botTypeId:botTypeId,
        label:req.body.label,
        content:req.body.content
    })
    if(!result) return res.status(500).json({status:'error',message:"error when saving data"})
    return res.status(200).json({status:'success',message:"data has been saved",data:result.id})
}

const update=async(req,res)=>{
    const botTypeId=parseInt(req.params.botTypeId);
    const id=parseInt(req.params.id);
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const oldData=await knowledgeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"knowledge not found"})
    const checkName=await knowledgeUtils.countLabel(botTypeId,req.body.label);
    if(checkName>0&&oldData.label!=req.body.label) return res.status(500).json({status:'error',
        message:"label already used"})
    const result=await knowledgeUtils.update({
        label:req.body.label,
        content:req.body.content
    },id)
    if(!result) return res.status(500).json({status:'error',message:"error when updating data"})
    return res.status(200).json({status:'success',message:"data has been updated",data:result.id})
}

const del=async(req,res)=>{
    const id=parseInt(req.params.id);
    const oldData=await knowledgeUtils.getOne(id);
    if (oldData==null) return res.status(404).json({status:'error',
        message:"knowledge not found"})
    const result=await knowledgeUtils.del(id)
    if(!result) return res.status(500).json({status:'error',message:"error when deleting data"})
    return res.status(200).json({status:'success',message:"data has been deleted",data:result.id})
}

module.exports={index,getOne,create,update,del}