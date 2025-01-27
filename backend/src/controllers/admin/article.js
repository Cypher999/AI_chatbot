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
        data=await models.article.findAll({
            where: 
            {
                [Op.or]: [
                { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                { '$category.name$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            order: [['date_created', 'DESC']],
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            },{
                model:models.category,
                required:false,
                attributes:['name']
            }],
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.article.count({
            where: 
            {
                [Op.or]: [
                { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                { '$category.name$': { [Op.like]: `%${req.query.q}%` } },
                { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                ]
            },
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            },{
                model:models.category,
                required:false,
                attributes:['name']
            }],
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.article.findAll({
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            },{
                model:models.category,
                required:false,
                attributes:['name']
            }],
            order: [['date_created', 'DESC']],
            limit:limit,
            offset:offset,
        })
        maxPage=await models.article.count()
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    data=data.map(item=>{
        if(__existSync('files/images/article/'+item.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-article/'+item.dataValues.img+".jpg");
        }
        return item;
    })
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const readOne=async (req,res)=>{    
    const data=await models.article.findOne({
        include:[{
            model:models.user,
            required:false,
            attributes:['fullname']
        },{
            model:models.category,
            required:false,
            attributes:['name']
        }],
        where:{
            id:req.params.id
        }
    });
    if(data){
        if(data.dataValues.type=="B"){
            data.dataValues.content=await models.blog.findOne({
                attributes:["content"],
                where:{
                    'article_id':data.dataValues.id
                }
            })
            data.dataValues.content.dataValues.content=data.dataValues.content.dataValues.content.replace("{{BASE_URL}}",__base_url())
        }
        else if(data.dataValues.type=="V"){
            data.dataValues.content=await models.video.findOne({
                attributes:["link"],
                where:{
                    'article_id':data.dataValues.id
                }
            })
        }
        if(data){
            if(__existSync('files/images/article/'+data.dataValues.img+".jpg")){
                data.dataValues._img=__base_url('img-article/'+data.dataValues.img+".jpg");
            }
        }
        return res.status(200).json({code:200,status:'success',data});
    }   
    return res.status(404).json({code:404,status:'error',"message":"not found"});
}
const prevOne=async (req,res)=>{    
    const data=await models.article.findOne({
        include:[{
            model:models.user,
            required:false,
            attributes:['fullname']
        },{
            model:models.category,
            required:false,
            attributes:['name']
        }],
        where:{
            title:req.params.id.replace(/-/g," ")
        }
    });
    if(data){
        if(data.dataValues.type=="B"){
            data.dataValues.content=await models.blog.findOne({
                attributes:["content"],
                where:{
                    'article_id':data.dataValues.id
                }
            })
            data.dataValues.content.dataValues.content=data.dataValues.content.dataValues.content.replace("{{BASE_URL}}",__base_url())
        }
        else if(data.dataValues.type=="V"){
            data.dataValues.content=await models.video.findOne({
                attributes:["link"],
                where:{
                    'article_id':data.dataValues.id
                }
            })
        }
        if(data){
            if(__existSync('files/images/article/'+data.dataValues.img+".jpg")){
                data.dataValues._img=__base_url('img-article/'+data.dataValues.img+".jpg");
            }
        }
        return res.status(200).json({code:200,status:'success',data});
    }   
    return res.status(404).json({code:404,status:'error',"message":"not found"});
}
const del=async (req,res)=>{
    
        const checkData=await models.article.findOne({
            where:
            {id:parseInt(req.params.id)}
            
        });
        if(checkData){
            const user=await models.article.findByPk(checkData.dataValues.id);
            user.destroy();
            return res.status(200).json({code:200,status:'success',user});
        }
        return res.status(404).json({code:200,status:'success',message:"not found"});
        
    
    
}
const create=async(req,res)=>{
    let objectTimeNow=new Date();
    const validator = joi.object({
        title: joi.string()
            .required()
            .max(125)
            .messages({
            'any.required': 'title is a required field'
            }),
        short_description: joi.string()
            .required()
            .max(125)
            .messages({
            'any.required': 'short description is a required field'
            }),
        type: joi.string()
            .required()
            .max(1)
            .messages({
            'any.required': 'type is required',
            }),
        category: joi.string()
            .required()
            .messages({
            'any.required': 'choose article category',
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
    const checkArticle=await models.article.count({
        where:{
            title:req.body.title
        }
    });
    if(checkArticle>0){
        return res.status(500).json({ code:500,status:"error",message: 'title already exists' });
    }
    const filename=generateRandom(10);
    let validator_content = null;
    if(req.body.type=="V"){
        validator_content = joi.object({
            link: joi.string()
                .required()
                .messages({
                'any.required': 'please insert video link'
                })
        }).unknown();
    }
    else if(req.body.type=="B"){
        validator_content =joi.object({
            content: joi.string()
                .required()
                .messages({
                'any.required': 'please insert content'
                })
        }).unknown()
    }
    let error_validation = validator_content.validate(req.body);
    error_validation=error_validation.error;
    if (error_validation) {
        return res.status(404).json({code:404, status:"error",message: error_validation.details.map(detail => detail.message) });
    }
    const checkCategory=await models.category.count({where:{id:req.body.category}});
    if(checkCategory<=0){
        return res.status(404).json({code:404,status:'error','message':'notfound'});
    }
    const article=await models.article.create({
        user_id:req.user_id,
        category_id:req.body.category,
        title:req.body.title,
        short_description:req.body.short_description,
        type:req.body.type,
        publish:0,
        img:req.files.img!==undefined?filename:"default",
        date_created:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds(),
        date_updated:null
    });
    if(article){
        if(req.files.img!==undefined){
            await uploads(req.files.img, "./files/images/article/" + filename + ".jpg");
        }
        if(req.body.type=="V"){
            await models.video.create({
                article_id:article.id,
                link:req.body.link
            });
        }
        else if(req.body.type=="B"){
            await models.blog.create({
                article_id:article.id,
                content:req.body.content.replace(__base_url(),"{{BASE_URL}}")
            });
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
        title: joi.string()
            .required()
            .max(125)
            .messages({
            'any.required': 'title is a required field'
            }),
        short_description: joi.string()
            .required()
            .max(125)
            .messages({
            'any.required': 'short description is a required field'
            }),
        category: joi.string()
            .required()
            .messages({
            'any.required': 'choose article category',
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
    const oldArticle=await models.article.findOne({
        where:
        {
            id:req.params.id
        }
        
    });
    const checkArticle=await models.article.count({
        where:
        {
            title:req.body.title
        } 
    });
    if(checkArticle>0&&oldArticle.dataValues.title!=req.body.title){
        return res.status(500).json({ code:500,status:"error",message: 'title already exists' });
    }
    const filename=generateRandom(10);
    let validator_content = null;
    if(oldArticle.dataValues.type=="V"){
        validator_content = joi.object({
            link: joi.string()
                .required()
                .messages({
                'any.required': 'please insert video link'
                })
        }).unknown();
    }
    else if(oldArticle.dataValues.type=="B"){
        validator_content =joi.object({
            content: joi.string()
                .required()
                .messages({
                'any.required': 'please insert content'
                })
        }).unknown()
    }
    let error_validation = validator_content.validate(req.body);
    error_validation=error_validation.error;
    if (error_validation) {
        return res.status(404).json({code:404, status:"error",message: error_validation.details.map(detail => detail.message) });
    }
    const checkCategory=await models.category.count({where:{id:req.body.category}});
    if(checkCategory<=0){
        return res.status(404).json({code:404,status:'error','message':'notfound'});
    }
    if(req.files.img!==undefined){
        if(oldArticle.dataValues.img!="default"){
            __unlinkSync('files/images/article/'+oldArticle.dataValues.img+".jpg")
        }
        await uploads(req.files.img, "./files/images/article/" + filename + ".jpg");
    }
    const article=await models.article.update({
        category_id:req.body.category,
        title:req.body.title,
        short_description:req.body.short_description,
        img:req.files.img!==undefined?filename:oldArticle.dataValues.img,
        date_updated:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds()
    },{
        where:{
            id:oldArticle.dataValues.id
        }
    });
    if(article){
        
        if(oldArticle.dataValues.type=="V"){
            await models.video.update({
                article_id:article.id,
                link:req.body.link
            },{
                where:{
                    article_id:oldArticle.dataValues.id
                }
            });
        }
        else if(oldArticle.dataValues.type=="B"){
            await models.blog.update({
                article_id:article.id,
                content:req.body.content.replace(__base_url(),"{{BASE_URL}}")
            },{
                where:{
                    article_id:oldArticle.dataValues.id
                }
            });
        }
        
        return res.status(200).json({code:200,status:'success','message':'data has been updated'});
    }
    else{
        return res.status(500).json({code:500,status:'error','message':article});
    }
}
const publish=async(req,res)=>{
    const article=await models.article.update({
        publish:1
    },{
        where:{
            id:req.params.id
        }
    });
    if(article){
        
        return res.status(200).json({code:200,status:'success','message':'article has been published'});
    }
    else{
        return res.status(500).json({code:500,status:'error','message':article});
    }
    
}
const unpublish=async(req,res)=>{
    const article=await models.article.update({
        publish:0
    },{
        where:{
            id:req.params.id
        }
    });
    if(article){
        
        return res.status(200).json({code:200,status:'success','message':'article has been pulled back'});
    }
    else{
        return res.status(500).json({code:500,status:'error','message':article});
    }
    
}
const uploadImage=async(req,res)=>{
    const filename=generateRandom(10);    
    if(req.files.upload!==undefined){
        
        if(req.files.upload.size/1000>1024){
            return res.status(500).json({ code:500,status:"error",message: 'max filesize is 1 Mb' });
        }
        if(req.files.upload.mimetype.split("/")[0] != 'image'){
            return res.status(500).json({ code:500,status:"error",message: 'file must be an image' });
        }
        await models.article_images.create({
            user_id:req.user_id,
            img:filename
        });
        await uploads(req.files.upload, "./files/images/pages/" + filename + ".jpg");
    }
    return res.json({url:process.env.BASE_URL+"img-pages/"+filename+".jpg"})
}
const deleteImage=async(req,res)=>{
    const checkData=await models.article_images.findOne({        
        where:{
            user_id:req.user_id,
            img:req.params.img
        }
    })
    if(checkData){
        const del=await models.article_images.findByPk(checkData.dataValues.id);
        del.destroy();
        return res.status(200).json({code:200,status:'success',message:del});
    }
    return res.status(500).json({code:500,status:'error',message:"error access"});
    
}
module.exports={index,create,update,publish,unpublish,readOne,prevOne,del,uploadImage,deleteImage};