const exp=require('express')
const models=__require("db/models/");
const joi=require('joi');
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const index=async (req,res)=>{
    let data=await models.config.findOne({
        attributes:['name','about_us'],
        where:{id:'1'}
    });
    if(data){
        if(__existSync('files/images/config/banner-img.jpg')){
            data.dataValues._banner=__base_url('img-config/banner-img.jpg');
        }
        if(__existSync('files/images/config/logo.png')){
            data.dataValues._logo=__base_url('img-config/logo.png');
        }
    }
    
    return res.status(200).json({code:200,status:'success',data});
}
const update=async(req,res)=>{
    const validator = joi.object({
    name: joi.string()
        .required()
        .messages({
        'any.required': 'app name is required'
        }),
    about_us: joi.string()
        .required()
        .messages({
        'any.required': 'about_us is required'
        })
    }).unknown();
    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    if(req.files.banner_img!==undefined){
        if(req.files.banner_img.size/1000>5200){
            return res.status(404).json({ error: 'max filesize is 5 Mb' });
        }
        if(req.files.banner_img.mimetype.split("/")[0] != 'image'){
            return res.status(404).json({ error: 'file must be an image' });
        }
    }
    if(req.files.logo!==undefined){
        if(req.files.logo.size/1000>5200){
            return res.status(404).json({ error: 'max filesize is 5 Mb' });
        }
        if(req.files.logo.mimetype!= 'image/png'){
            return res.status(404).json({ error: 'logo must be an png' });
        }
    }
    
    const conf=await models.config.update({
        name:req.body.name,
        about_us:req.body.about_us,
        
    },{
        where:{
            id:1
        }
    });
    if(conf){
        if (req.files.banner_img) {
            await uploads(req.files.banner_img, "./files/images/config/banner-img.jpg");
        }
        if (req.files.logo) {
            await uploads(req.files.logo, "./files/images/config/logo.png");
        }
        return res.status(200).json({code:200,status:'success','message':'data has been updated',data:conf});
    }
    else{
        return res.status(500).json({status:'error','message':conf});
    }
}
module.exports={index,update};