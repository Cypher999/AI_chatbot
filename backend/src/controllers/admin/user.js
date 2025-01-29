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
            data=await models.user.findAll({
                where: {
                    [Op.or]: [
                    { username: { [Op.like]: `%${req.query.q}%` } },
                    { fullname: { [Op.like]: `%${req.query.q}%` } }
                    ]
                },
                limit:limit,
                offset:offset,
                
            })
            maxPage=await models.user.count({
                where: {
                [Op.or]: [
                    
                    
                    { username: { [Op.like]: `%${req.query.q}%` } },
                    { fullname: { [Op.like]: `%${req.query.q}%` } }
                    ]
                }
            })
            maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
            
        }
        else{
            data=await models.user.findAll({
                limit:limit,
                offset:offset,
            })
            maxPage=await models.user.count()
            maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
            
        }
        data=data.map(item=>{
            // console.log(__existSync('files/images/user/'+item.dataValues.img+".jpg"));
            if(__existSync('files/images/user/'+item.dataValues.img+".jpg")){
                item.dataValues._img=__base_url('img-user/'+item.dataValues.img+".jpg");
            }
            return item;
        })
        return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});
    
}
const readOne=async (req,res)=>{
    const data=await models.user.findOne({
        where:{
            id:parseInt(req.params.id)   
        }
    });
    if(data){
        if(__existSync('files/images/user/'+data.dataValues.img+".jpg")){
            data.dataValues._img=__base_url('img-user/'+data.dataValues.img+".jpg");
        }
    }
    return res.status(200).json({code:200,status:'success',data});
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
    const user=await models.user.update({
        password:await hashPassword.hashPassword(req.body.password),
    },{
        where:{
            id:req.params.id
        }
    });
    if(user){
        return res.status(200).json({code:200,status:'success','message':'password has been updated'});
    }
    else{
        return res.status(500).json({status:'error','message':user});
    }
}
module.exports={index,updatePassword,readOne};