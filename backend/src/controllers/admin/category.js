const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const index=async (req,res)=>{
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const offset=req.query.limit?page*parseInt(req.query.limit):0;
    const limit=req.query.limit?parseInt(req.query.limit):10;
    let data={};
    let maxPage=0;
    
    if(req.query.q){
        data=await models.category.findAll({
            where: {
                [Op.or]: [
                { '$category.name$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.category.count({
            where: {
            [Op.or]: [
                { '$category.name$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.category.findAll({
            
            limit:limit,
            offset:offset,
        })
        maxPage=await models.category.count()
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const select2=async (req,res)=>{
    let data={};
    if(req.query.q){
        data=await models.category.findAll({
            where: {
                [Op.or]: [
                { '$category.name$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },            
        })        
    }
    else{
        data=await models.category.findAll()
        
    }
    return res.status(200).json({code:200,status:'success',data});

}
const readOne=async (req,res)=>{
    const data=await models.category.findOne({
        where:{
            id:parseInt(req.params.id)   
        }
    });
    return res.status(200).json({code:200,status:'success',data});
}
const del=async (req,res)=>{
    const user=await models.category.findByPk(req.params.id);
    user.destroy();
    return res.status(200).json({code:200,status:'success',user});
}
const create=async(req,res)=>{
    const validator = joi.object({
        name: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'name is a required field'
            })
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const checkname=await models.category.count({
        where:{
            name:req.body.name
        }
    });
    if(checkname>0){
        return res.status(500).json({ code:500,status:"error",message: 'name already exists' });
    }
    const user=await models.category.create({
        name:req.body.name,
    });
    if(user){
        return res.status(200).json({code:200,status:'success','message':'data has been added'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
const update=async(req,res)=>{
    const validator = joi.object({
        name: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'name is a required field'
            })
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }

    
    const checkname=await models.category.count({
        where:{
            name:req.body.name
        }
    });
    if(checkname>0){
        return res.status(500).json({ code:500,status:"error",message: 'name already exists' });
    }    
    const staff=await models.category.update({
        name:req.body.name,
    },{
        where:{
            id:parseInt(req.params.id)
        }
    });
    if(staff){        
        
        return res.status(200).json({code:200,status:'success','message':'data has been updated'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }

    return res.status(404).json({code:404,status:'error','message':'notfound'});
}
module.exports={index,create,update,select2,readOne,del};