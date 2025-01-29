const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const hashPassword=__require("thirdparty/hashPassword")
const index=async (req,res)=>{
    
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const offset=req.query.limit?page*parseInt(req.query.limit):0;
    const limit=req.query.limit?parseInt(req.query.limit):10;
    let data={};
    let maxPage=0;
    if(req.query.q){
        data=await models.staff.findAll({
            where: {
                [Op.or]: [
                { '$staff.short_bio$': { [Op.like]: `%${req.query.q}%` } },
                { '$staff.bio$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.username$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            include:{
                model:models.user,
                required:true,
                attributes:['username','fullname','img']
            },
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.staff.count({
            where: {
            [Op.or]: [
                { '$staff.short_bio$': { [Op.like]: `%${req.query.q}%` } },
                { '$staff.bio$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.username$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            include:{
                model:models.user,
                required:false,
            }
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.staff.findAll({
            include:{
                model:models.user,
                required:false,
                attributes:['username','fullname','img']
            },
            limit:limit,
            offset:offset,
        })
        maxPage=await models.staff.count()
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    data=data.map(item=>{
        // console.log(__existSync('files/images/user/'+item.dataValues.img+".jpg"));
        if(__existSync('files/images/user/'+item.dataValues.user.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-user/'+item.dataValues.user.dataValues.img+".jpg");
        }
        return item;
    })
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const readOne=async (req,res)=>{
    const data=await models.staff.findOne({
        include:[{
            model:models.user,
            required:false,
            attributes:['username','fullname','img']
        },
        {
            model:models.contact,
            required:false,
        }
        ],
        where:{
            id:parseInt(req.params.id)   
        }
    });
    if(data){
        if(__existSync('files/images/user/'+data.dataValues.user.dataValues.img+".jpg")){
            data.dataValues._img=__base_url('img-user/'+data.dataValues.user.dataValues.img+".jpg");
        }
    }
    return res.status(200).json({code:200,status:'success',data});
}
const del=async (req,res)=>{
    const staff=await models.staff.findByPk(req.params.id);
    const user=await models.user.findByPk(staff?.dataValues?.user_id);
    user.destroy();
    return res.status(200).json({code:200,status:'success',user});
}
const create=async(req,res)=>{
    const validator = joi.object({
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
        bio: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'bio is a required field'
            }),
        short_bio:joi.string() 
            .required()
            .max(100)
            .messages({
            'any.required': 'short bio is a required field'
            })
    }).unknown();
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    if(req.files.img!==undefined){
        if(req.files.img.size/1000>5200){
            return res.status(500).json({ code:500,status:"error",message: 'max filesize is 5 Mb' });
        }
        if(req.files.img.mimetype.split("/")[0] != 'image'){
            return res.status(500).json({ code:500,status:"error",message: 'file must be an image' });
        }
    }
    const checkUsername=await models.user.count({
        where:{
            username:req.body.username
        }
    });
    if(checkUsername>0){
        return res.status(500).json({ code:500,status:"error",message: 'username already exists' });
    }
    const filename=generateRandom(10);
    const user=await models.user.create({
        username:req.body.username,
        fullname:req.body.fullname,
        password:await hashPassword.hashPassword(req.body.password),
        img:req.files.img!==undefined?filename:"man",
        type:'W'
    });
    if(user){
        await models.staff.create({
            user_id:user.id,
            bio:req.body.bio,
            short_bio:req.body.short_bio,
            portfolio_link:req.body.portfolio_link?req.body.portfolio_link:""
        });
        if(req.files.img!==undefined){
            await uploads(req.files.img, "./files/images/user/" + filename + ".jpg");
        }
        return res.status(200).json({code:200,status:'success','message':'data has been added'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
const update=async(req,res)=>{
    const validator = joi.object({
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
        bio: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'Bio is a required field'
            }),
        short_bio:joi.string() 
            .required()
            .max(100)
            .messages({
            'any.required': 'short bio is a required field'
            })
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

    const oldData=await models.staff.findOne({
        include:{
            model:models.user,
            required:false,            
        },
        where:{
            id:parseInt(req.params.id)
        }
    });
    if(oldData){
        const checkUsername=await models.user.count({
            where:{
                username:req.body.username
            }
        });
        if(checkUsername>0&&oldData.dataValues.user.dataValues.username!=req.body.username){
            return res.status(500).json({ code:500,status:"error",message: 'username already exists' });
        }    
        const staff=await models.staff.update({
            bio:req.body.bio,
            short_bio:req.body.short_bio,
            portfolio_link:req.body.portfolio_link?req.body.portfolio_link:""
        },{
            where:{
                id:parseInt(req.params.id)
            }
        });
        if(staff){
            const filename=generateRandom(10);
            if(req.files.img!==undefined){
                if(oldData.dataValues.user.dataValues.img!="man"){
                    __unlinkSync('files/images/user/'+oldData.dataValues.user.dataValues.img+".jpg")
                }
                await uploads(req.files.img, "./files/images/user/" + filename + ".jpg");
            }
            await models.user.update({
                username:req.body.username,
                fullname:req.body.fullname,
                img:req.files.img!==undefined?filename:oldData.dataValues.img
            },{
                where:{
                    id:parseInt(oldData.dataValues.user_id)
                }
            });
            
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
    const staff=await models.staff.findByPk(req.params.id);
    const user=await models.user.update({
        password:await hashPassword.hashPassword(req.body.password),
    },{
        where:{
            id:staff.dataValues?.user_id
        }
    });
    if(user){
        return res.status(200).json({code:200,status:'success','message':'password has been updated'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
module.exports={index,create,update,updatePassword,readOne,del};