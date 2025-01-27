const exp=require('express')
const models=__require("db/models/");
const hashPassword=__require("thirdparty/hashPassword");
const GAT=__require('thirdparty/generateAccessToken');
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const {dateParse}=__require("thirdparty/dateParse")
const moment=require('moment')
const {literal}=require('sequelize')
const { Op } = require('sequelize'); 
const axios =require('axios');
const secret_key=process.env.GOOGLE_CAPTCHA_SECRETKEY;
const index=async (req,res)=>{
    const staff=await models.staff.findOne({where:{user_id:req.user_id}});
    const article_video=await models.article.count({where:{type:'V',user_id:req.user_id}});
    const article_blog=await models.article.count({where:{type:'B',user_id:req.user_id}});
    const ebook = await models.ebook.count({where:{user_id:req.user_id}});
    const contact = await models.contact.count({where:{'staff_id':staff.dataValues.id}})
      
    return res.status(200).json({code:200,status:'success',data:{article_video,article_blog,ebook,contact}});


    
    

    
}

module.exports={index};