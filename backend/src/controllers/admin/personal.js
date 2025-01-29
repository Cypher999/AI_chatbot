const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const hashPassword=__require("thirdparty/hashPassword")
const {timeParse}=__require("thirdparty/dateParse")
const index=async (req,res)=>{
    let data=await models.user.findOne({
        where:{
            id:req.user_id
        }
    })
    let sessionNow=await models.login_session.findOne({
        attributes:["id"],
        where:{                
                [Op.and]:[
                    {user_id:req.user_id},
                    {device:req.headers['user-agent']},
                    {ip:req.ip},
                ]
            
        }
    })
    let session=await models.login_session.findAll({
        where:{
                user_id:req.user_id,
                id:{[Op.ne]:sessionNow.dataValues.id}
            
        }
    })
    console.log(req.headers['user-agent'])
    session=session.map((item)=>{
        item.dataValues._created_at=timeParse(item.dataValues.created_at);
        return item
    })
    if(__existSync('files/images/user/'+data.dataValues.img+".jpg")){
        data.dataValues._img=__base_url('img-user/'+data.dataValues.img+".jpg");
    }
    else{
        data.dataValues._img=__base_url('img-user/man.jpg');
    }
    return res.status(200).json({code:200,status:'success',data:{
        profile:data,
        session:session
    }});

}
const updateData=async(req,res)=>{
    let validator = joi.object({
        username: joi.string()
            .required()
            .max(100)
            .messages({
            'any.required': 'username is a required field'
            }),
        fullname: joi.string()
            .required()
            .max(100)
            .messages({
            'any.required': 'fullname is a required field'
            }),
    }).unknown();
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    if(req.files.img!==undefined){
        if(req.files.img.size/1000>5200){
            return res.status(404).json({ error: 'max filesize is 5 Mb' });
        }
        if(req.files.img.mimetype.split("/")[0] != 'image'){
            return res.status(404).json({ error: 'file must be an image' });
        }
    }

    const oldData=await models.user.findOne({
        where:{
            id:parseInt(req.user_id)
        }
    });
    if(oldData){
        const filename=generateRandom(10);
        if(req.files.img!==undefined){
            if(oldData.dataValues.img){
                if(oldData.dataValues.img!="man"){
                    __unlinkSync('files/images/user/'+oldData.dataValues.img+".jpg")
                }
            }
            await uploads(req.files.img, "./files/images/user/" + filename + ".jpg");
        }
        const checkUsername=await models.user.count({
            where:{
                username:req.body.username
            }
        });
        if(checkUsername>0&&oldData.dataValues.username!=req.body.username){
            return res.status(500).json({ code:500,status:"error",message: 'username already exists' });
        }

        const user=await models.user.update({
            username:req.body.username,
            fullname:req.body.fullname,
            img:req.files.img!==undefined?filename:oldData.dataValues.img
        },{
            where:{
                id:parseInt(req.user_id)
            }
        });
        if(user){
            return res.status(200).json({code:200,status:'success','message':'data has been updated'});
        }
        else{
            return res.status(500).json({status:'error','message':user});
        }
    }
    return res.status(404).json({code:404,status:'error','message':'notfound'});
}
const updatePassword=async(req,res)=>{
    const validator = joi.object({
        old: joi.string()
            
            .required()
            .messages({
            'any.required': 'insert your oldpassword',
            'any.min':'oldpassword must more than 8 character'
            }),
        password: joi.string()
            .min(8)
            .required()
            .messages({
            'any.required': 'password is required',
            'any.min':'password must more than 8 character'
            }),
        confirm: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({
            'any.only':'password must match with confirm',
            'any.required': 'confirm is required',
            }),
    });
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const oldData=await models.user.findOne({
        where:{
            id:parseInt(req.user_id)
        }
    });
    if(!await hashPassword.verifyPassword(req.body.old,oldData.password)){
        return res.status(500).json({ status:"error","message":"old password doesnt match"});
    }
    const user=await models.user.update({
        password:await hashPassword.hashPassword(req.body.password),
    },{
        where:{
            id:req.user_id
        }
    });
    if(user){
        return res.status(200).json({code:200,status:'success','message':'password has been updated'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
const deleteSession=async (req,res)=>{
    const checkData=await models.login_session.findOne({
        where:
        {id:parseInt(req.params.id),
        user_id:req.user_id
        }
        
    });
    if(checkData){
        const user=await models.login_session.findByPk(checkData.dataValues.id);
        user.destroy();
        return res.status(200).json({code:200,status:'success',user});
    }
    return res.status(403).json({status:'error',message:'not found'});
}

const deleteAllSession=async (req,res)=>{
    let sessionNow=await models.login_session.findOne({
        attributes:["id"],
        where:{                
                [Op.and]:[
                    {user_id:req.user_id},
                    {device:req.headers['user-agent']},
                    {ip:req.ip},
                ]
            
        }
    })
    if(sessionNow){
        const user=await models.login_session.destroy({
            where:{
                id:{[Op.ne]:sessionNow.dataValues.id}
            }
        });
        return res.status(200).json({code:200,status:'success',user});
    }
    return res.status(200).json({code:200,status:'success'});
}
module.exports={index,updateData,updatePassword,deleteSession,deleteAllSession};