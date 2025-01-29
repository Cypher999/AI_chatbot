const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 

const sendComment=async(req,res)=>{
    const validator = joi.object({
        comment: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'comment cannot be empty'
            })
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    let objectTimeNow=new Date();
    const mentionedUser=req.body.comment.match(/@\w+/g);
    const comment=await models.comment.create({
        user_id:req.user_id,
        comment:req.body.comment,
        article_id:req.params.id,
        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
    });
    if(comment){
        const checkUserComment=await models.user.findOne({
            where:{
                id:req.user_id
            },
            attributes:['fullname','type']
        })
        const checkArticle=await models.article.findOne({
            where:{
                id:req.params.id
            },
            attributes:['id','user_id','title']
        })
        let quick_link="{{BASE_URL}}read/"+checkArticle.dataValues.title.replace(" ","-");        
        if(checkArticle.dataValues.user_id!=req.user_id){
            await models.notification.create({
                user_to:checkArticle.dataValues.user_id,
                user_from:req.user_id,
                message:`${checkUserComment.dataValues.fullname} commenting on article ${checkArticle.dataValues.title}`,
                quick_link:quick_link,
                date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
                read:0
            })
            
        }
        if(mentionedUser){
            mentionedUser.forEach(async(item)=>{
                let userName=item.split("@")[1];
                let checkUsername=await models.user.findOne({
                    where:{
                        fullname:userName,
                        id:{[Op.ne]:req.user_id}
                    },
                    attributes:['id']
                });
                if(checkUsername){
                    await models.notification.create({
                        user_to:checkUsername.dataValues.id,
                        user_from:req.user_id,
                        read:0,
                        message:`${checkUserComment.dataValues.fullname} is mentioning you on article ${checkArticle.dataValues.title}`,
                        quick_link:quick_link,
                        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
                    })
                }
            })
        }
        return res.status(200).json({code:200,status:'success','message':'comment has been sent'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
const deleteComment=async(req,res)=>{
    const checkData=await models.comment.findOne({
        where:
        {id:parseInt(req.params.id),
        user_id:req.user_id
        }
        
    });
    if(checkData){
        const user=await models.comment.findByPk(checkData.dataValues.id);
        user.destroy();
        return res.status(200).json({code:200,status:'success',message:"comment has been deleted"});
    }
    return res.status(404).json({code:200,status:'success',message:"not found"});
}
const deleteReply=async(req,res)=>{
    const checkData=await models.reply.findOne({
        where:
        {id:parseInt(req.params.id),
        user_id:req.user_id
        }
        
    });
    if(checkData){
        const user=await models.reply.findByPk(checkData.dataValues.id);
        user.destroy();
        return res.status(200).json({code:200,status:'success',message:"reply has been deleted"});
    }
    return res.status(404).json({code:200,status:'success',message:"not found"});
}
const sendReply=async(req,res)=>{
    const validator = joi.object({
        reply: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'reply cannot be empty'
            })
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    let objectTimeNow=new Date();
    let reply=req.body.reply;
    const mentionedUser=reply.match(/@\w+/g);
    
    const comment=await models.reply.create({
        user_id:req.user_id,
        reply:reply,
        comment_id:req.params.id,        
        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
    });
    console.log(comment)
    if(comment){
        console.log('sent')
        const checkUserReply=await models.user.findOne({
            where:{
                id:req.user_id
            },
            attributes:['fullname','type']
        })
        const checkComment=await models.comment.findOne({
            where:{
                id:req.params.id
            },
            attributes:['article_id','user_id']
        })
        const checkArticle=await models.article.findOne({
            where:{
                id:checkComment.dataValues.article_id
            },
            attributes:['id','user_id','title']
        })
        let quick_link="{{BASE_URL}}read/"+checkArticle.dataValues.title.replace(" ","-");
        console.log(checkComment.dataValues)
        if(checkComment.dataValues.user_id!=req.user_id){            
            await models.notification.create({
                user_to:checkComment.dataValues.user_id,
                user_from:req.user_id,
                read:0,
                message:`${checkUserReply.dataValues.fullname} is replying your comment on article ${checkArticle.dataValues.title}`,
                quick_link:quick_link,
                date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
            })
        }
        if(mentionedUser){
            mentionedUser.forEach(async(item)=>{
                console.log(item)
                let userName=item.split("@")[1];
                let checkUsername=await models.user.findOne({
                    where:{
                        fullname:userName,
                        id:{[Op.ne]:req.user_id}
                    },
                    attributes:['id']
                });
                
                if(checkUsername){
                    await models.notification.create({
                        user_to:checkUsername.dataValues.id,
                        user_from:req.user_id,
                        read:0,
                        message:`${checkUserReply.dataValues.fullname} is mentioning you on article ${checkArticle.dataValues.title}`,
                        quick_link:quick_link,
                        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
                    })
                }
            })
        }
        
        return res.status(200).json({code:200,status:'success','message':'reply has been sent'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
module.exports={sendComment,sendReply,deleteComment,deleteReply};