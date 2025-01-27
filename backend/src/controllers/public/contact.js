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
    
    let staff=await models.staff.findOne({where:{user_id:req.user_id}});
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
                    staff_id:staff.dataValues.id
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
                    staff_id:staff.dataValues.id
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
                staff_id:staff.dataValues.id
            }
            
        })
        maxPage=await models.contact.count({
            where:{
                staff_id:staff.dataValues.id
            }
            
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});
}
const readOne=async (req,res)=>{
    let staff=await models.staff.findOne({where:{user_id:req.user_id}});
    const data=await models.contact.findOne({
        where:
        {[Op.and]:[
            {
                id:parseInt(req.params.id)   
            },
            {
                staff_id:parseInt(staff.dataValues.id)   
            }
        ]}
        
        
    });
    return res.status(200).json({code:200,status:'success',data});
}

module.exports={index,readOne};