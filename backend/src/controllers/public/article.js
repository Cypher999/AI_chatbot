const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const {dateParse}=__require("thirdparty/dateParse")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const dateDiff=__require("thirdparty/dateDiff");
const index=async (req,res)=>{    
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const limit=10;
    const offset=page*limit;        
    let data={};
    let maxPage=0;
    if(req.query.q){
        data=await models.article.findAll({
            where: 
            (req.query.category&&req.query.category!="-")
            ?
            {
                [Op.and]:[
                    {
                        [Op.or]: [
                            { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                            { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                            ]
                    },
                    {category_id:req.query.category},
                    {publish:1}
                ]
                
            }
            :
            {
                [Op.and]:[
                    {
                        [Op.or]: [
                            { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                            { '$category.name$': { [Op.like]: `%${req.query.q}%` } },
                            { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                            ]
                    },
                    {publish:1}
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
            order: [['date_created', 'DESC']],
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.article.count({
            where: 
            (req.query.category&&req.query.category!="-")
            ?
            {
                [Op.and]:[
                    {
                        [Op.or]: [
                            { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                            { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                            ]
                    },
                    {category_id:req.query.category},
                    {publish:1}
                ]
                
            }
            :
            {
                [Op.and]:[
                    {
                        [Op.or]: [
                            { '$article.title$': { [Op.like]: `%${req.query.q}%` } },
                            { '$category.name$': { [Op.like]: `%${req.query.q}%` } },
                            { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                            ]
                        
                        
                    },
                    {publish:1}
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
            where:{
                [Op.and]:[
                    (req.query.category&&req.query.category!="-")
                    ?
                    {category_id:req.query.category}
                    :
                    {},
                    {publish:1}
                ]
            }
            ,
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
        maxPage=await models.article.count({
            where:{
                [Op.and]:[
                    (req.query.category&&req.query.category!="-")
                    ?
                    {category_id:req.query.category}
                    :
                    {},
                    {publish:1}
                ]
            }
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    data=data.map(item=>{
        if(__existSync('files/images/article/'+item.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-article/'+item.dataValues.img+".jpg");
        }
        item.dataValues._date_created=dateParse(item.dataValues.date_created);
        item.dataValues._slug=item.dataValues.title.replace(/ /g,"-");
        return item;
    })
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const readOne=async (req,res)=>{
    const data=await models.article.findOne({
        attributes:{
            exclude:['user_id']
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
        where:{
            title:req.params.id.replace(/-/g," ")
        }
    });
    if(data){
        data.dataValues._date_created=dateParse(data.dataValues.date_created);
        if(data.dataValues.type=="B"){
            data.dataValues.content=await models.blog.findOne({
                where:{
                    'article_id':data.dataValues.id
                }
            })
            data.dataValues.content.dataValues.content=data.dataValues.content.dataValues.content.replace("{{BASE_URL}}",__base_url())
        }
        else if(data.dataValues.type=="V"){
            data.dataValues.content=await models.video.findOne({
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

    return res.status(404).json({code:404,status:'error',"message":"article not found"});
}
const readComment=async(req,res)=>{
    const data=await models.comment.findAll({
        where:{
            article_id:req.params.article
        },
        attributes:['id','user_id','comment','date_created'],
        include:[
            {
                model:models.user,
                required:false,
                attributes:['fullname']
            },
            {
                model:models.reply,
                required:false,
                attributes:['id','reply','user_id','date_created'],
                include:[
                    {
                        model:models.user,
                        required:false,
                        attributes:['fullname']
                    }
                ]
            }
        ]
    });
    let dateDifference="";
    data.forEach((item,index)=>{
        item.dataValues.allow_delete=item.user_id==req.user_id;
        dateDifference=dateDiff.dateDiffNow(
            item.dataValues.date_created
        )
        if(dateDifference.D>0){
            item.dataValues._time=dateDifference.D+" Days Ago";
        }
        else if(dateDifference.H>0){
            item.dataValues._time=dateDifference.H+" Hours Ago";
        }
        else if(dateDifference.M>0){
            item.dataValues._time=dateDifference.M+" Minutes Ago";
        }
        else if(dateDifference.D>0){
            item.dataValues._time=dateDifference.D+" Seconds Ago";
        }
        else{
            item.dataValues._time=" Recently";
        }
        item.dataValues.replies.forEach((reply,index)=>{
            reply.dataValues.allow_delete=reply.user_id==req.user_id;
            dateDifference=dateDiff.dateDiffNow(
                reply.dataValues.date_created
            )
            if(dateDifference.D>0){
                reply.dataValues._time=dateDifference.D+" Days Ago";
            }
            else if(dateDifference.H>0){
                reply.dataValues._time=dateDifference.H+" Hours Ago";
            }
            else if(dateDifference.M>0){
                reply.dataValues._time=dateDifference.M+" Minutes Ago";
            }
            else if(dateDifference.D>0){
                reply.dataValues._time=dateDifference.D+" Seconds Ago";
            }
            else{
                reply.dataValues._time=" Recently";
            }
            delete(item.dataValues.user_id);
        })
        delete(item.dataValues.user_id);
    })
    return res.status(200).json({code:200,status:'success',data});
}
module.exports={index,readOne,readComment};