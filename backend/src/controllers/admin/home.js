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
    
    const staff=await models.staff.count();
    const article_video=await models.article.count({where:{type:'V'}});
    const article_blog=await models.article.count({where:{type:'B'}});
    const category = await models.category.count();
    const user_writer = await models.user.count({where:{type:'W'}});
    const ebook = await models.ebook.count();
    const contact = await models.contact.count();
    const article_bloc = await models.article.count({where:{type:'B'}});
      
    return res.status(200).json({code:200,status:'success',data:{staff,article_video,article_blog,category,user_writer,ebook,contact}});


    
    

    
}

module.exports={index};