const exp=require('express')
const models=__require("db/models/");
const { Op } = require('sequelize'); 

const category=async (req,res)=>{
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
module.exports={category};