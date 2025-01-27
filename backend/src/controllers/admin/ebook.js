const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const {dateParse}=__require("thirdparty/dateParse")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const index=async (req,res)=>{
    
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const offset=req.query.limit?page*parseInt(req.query.limit):0;
    const limit=req.query.limit?parseInt(req.query.limit):10;
    let data={};
    let maxPage=0;
    if(req.query.q){
        data=await models.ebook.findAll({
            where: 
            {
                [Op.or]: [
                { '$ebook.name$': { [Op.like]: `%${req.query.q}%` } },
                { '$ebook.description$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            }],
            order: [['date_created', 'DESC']],
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.ebook.count({
            where: 
            {
                [Op.or]: [
                { '$ebook.name$': { [Op.like]: `%${req.query.q}%` } },
                { '$ebook.description$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            }],
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.ebook.findAll({
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            }],
            order: [['date_created', 'DESC']],
            limit:limit,
            offset:offset,
        })
        maxPage=await models.ebook.count()
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    data=data.map(item=>{
        if(__existSync('files/images/ebook/'+item.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-ebook/'+item.dataValues.img+".jpg");
        }
        return item;
    })
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const readOne=async (req,res)=>{    
    const data=await models.ebook.findOne({
        include:[{
            model:models.user,
            required:false
        }],
        where:{
            id:req.params.id
        }
    });
    if(data){
        if(data){
            if(__existSync('files/images/ebook/'+data.dataValues.img+".jpg")){
                data.dataValues._img=__base_url('img-ebook/'+data.dataValues.img+".jpg");
            }
        }
        return res.status(200).json({code:200,status:'success',data});
    }     
    return res.status(404).json({code:404,status:'error',"message":"not found"});
}
const del=async (req,res)=>{
    const checkData=await models.ebook.findOne({
        where:
        {id:parseInt(req.params.id)}
        
    });
    if(checkData){
        const user=await models.ebook.findByPk(checkData.dataValues.id);
        user.destroy();
        return res.status(200).json({code:200,status:'success',user});
    }
    return res.status(403).json({status:'error',message:'not found'});
}
const create=async(req,res)=>{
    let objectTimeNow=new Date();
    const validator = joi.object({
        name: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'name is a required field'
            }),
        link: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'link is required',
            }),
        description: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'choose article description',
            })
    }).unknown();
    let { error } = validator.validate(req.body);
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
    const checkArticle=await models.ebook.count({
        where:{
            name:req.body.name
        }
    });
    if(checkArticle>0){
        return res.status(500).json({ code:500,status:"error",message: 'name already exists' });
    }
    const filename=generateRandom(10);
    const article=await models.ebook.create({
        user_id:req.user_id,
        description:req.body.description,
        name:req.body.name,
        link:req.body.link,
        img:req.files.img!==undefined?filename:"default",
        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
        
    });
    if(article){
        if(req.files.img!==undefined){
            await uploads(req.files.img, "./files/images/ebook/" + filename + ".jpg");
        }        
        return res.status(200).json({code:200,status:'success','message':'data has been added'});
    }
    else{
        return res.status(500).json({code:500,status:'error','message':article});
    }
}
const update=async(req,res)=>{
    let objectTimeNow=new Date();
    const validator = joi.object({
        name: joi.string()
            .required()
            .max(50)
            .messages({
            'any.required': 'name is a required field'
            }),
        link: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'link is required',
            }),
        description: joi.string()
            .required()
            .max(512)
            .messages({
            'any.required': 'choose article description',
            })
    }).unknown();
    let { error } = validator.validate(req.body);
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
    const oldArticle=await models.ebook.findOne({
        where:
        {
            id:req.params.id
        }
    });
    const checkArticle=await models.ebook.count({
        where:
        {
            name:req.body.name
        } 
    });
    if(checkArticle>0&&oldArticle.dataValues.name!=req.body.name){
        return res.status(500).json({ code:500,status:"error",message: `ebook with name ${req.body.name} already exists` });
    }
    const filename=generateRandom(10);
    if(req.files.img!==undefined){
        if(oldArticle.dataValues.img!="default"){
            __unlinkSync('./files/images/ebook/'+oldArticle.dataValues.img+".jpg")
        }
        await uploads(req.files.img, "./files/images/ebook/" + filename + ".jpg");
    }
    const article=await models.ebook.update({
        description:req.body.description,
        name:req.body.name,
        img:req.files.img!==undefined?filename:oldArticle.dataValues.img,
        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
        link:req.body.link
    },{
        where:{
            id:oldArticle.dataValues.id
        }
    });
    if(article){
        
        return res.status(200).json({code:200,status:'success','message':'data has been updated'});
    }
    else{
        return res.status(500).json({code:500,status:'error','message':article});
    }
}
module.exports={index,create,update,readOne,del};