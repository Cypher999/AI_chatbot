const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const index=async (req,res)=>{
    let data={};
    data=await models.category.findAll();
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
module.exports={index,readOne};