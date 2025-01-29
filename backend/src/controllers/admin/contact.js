const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const index=async (req,res)=>{
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const limit=req.query.limit?parseInt(req.query.limit):10;
    const offset=page*limit;    
    let data={};
    let maxPage=0;
    if(req.query.q){
        data=await models.contact.findAll({
            limit:limit,
            offset:offset,
            where: 
            {
                [Op.and]:[{
                    [Op.or]: [
                        { link: { [Op.like]: `%${req.query.q}%` } },
                        ],
                    staff_id:req.params.staff_id
                }]    
            }
        })
        maxPage=await models.contact.count({
            where: 
            {
                [Op.and]:[{
                    [Op.or]: [
                        { link: { [Op.like]: `%${req.query.q}%` } },
                        ],
                        staff_id:req.params.staff_id
                }]    
            }
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.contact.findAll({
            limit:limit,
            offset:offset,
            where:{
                staff_id:req.params.staff_id
            }
        })
        maxPage=await models.contact.count({
            where:{
                staff_id:req.params.staff_id 
            }
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});
}
const readOne=async (req,res)=>{
    let staff=await models.staff.findOne({where:{user_id:req.params.staff_id}});
    const data=await models.contact.findOne({
        where:
        {[Op.and]:[
            {
                id:parseInt(req.params.id)   
            },
            {
                staff_id:req.params.staff_id
            }
        ]}
        
    });
    return res.status(200).json({code:200,status:'success',data});
}
const del=async (req,res)=>{
    const EB=await models.contact.destroy({
        where:
        {id:parseInt(req.params.id)
          }
    });
    
    return res.status(200).json({code:200,status:'success',message:"contact has been deleted"});
}
const create=async(req,res)=>{
    const validator = joi.object({
    icon: joi.string()
        .required()
        .messages({
        'any.required': 'icon is a required field'
        }),
    link: joi.string()
        .required()
        .messages({
        'any.required': 'link is a required field'
        }),
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const title_img=generateRandom(5);
    const EB=await models.contact.create({
        staff_id:req.params.staff_id,
        icon:req.body.icon,
        link:req.body.link,
    });
    if(EB){
        return res.status(200).json({code:200,status:'success','message':'data has been added',data:EB});
    }
    else{
        return res.status(500).json({status:'error','message':EB});
    }
}
const update=async(req,res)=>{
    const validator = joi.object({
    icon: joi.string()
        .required()
        .messages({
        'any.required': 'icon is a required field'
        }),
    link: joi.string()
        .required()
        .messages({
        'any.required': 'link is a required field'
        })
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const EB=await models.contact.update({
        icon:req.body.icon,
        link:req.body.link,
    },{
        where:
        {id:parseInt(req.params.id)
        }
    });
    if(EB){
        return res.status(200).json({code:200,status:'success','message':'data has been updated',data:EB});
    }
    else{
        return res.status(500).json({status:'error','message':EB});
    }
}
module.exports={index,create,update,readOne,del};