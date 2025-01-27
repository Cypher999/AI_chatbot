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
    const limit=10;
    const offset=page*limit;
    
    let data={};
    let maxPage=0;
    if(req.query.q){
        data=await models.ebook.findAll({
            where: 
            {
                [Op.or]: [
                    { '$ebook.name$': { [Op.like]: `%${req.query.q}%` } },
                    { '$user.fullname$': { [Op.like]: `%${req.query.q}%` } }
                    ]
                
            }
            ,
            include:[{
                model:models.user,
                required:false,
                attributes:['fullname']
            }],
            limit:limit,
            offset:offset,
            
        })
        maxPage=await models.ebook.count({
            where: 
            {
                [Op.or]: [
                    { '$ebook.name$': { [Op.like]: `%${req.query.q}%` } },
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
        item.dataValues._date_created=dateParse(item.dataValues.date_created);
        return item;
    })
    return res.status(200).json({code:200,status:'success',data,meta:{pagination:{maxPage,page:page+1}}});

}
const readOne=async (req,res)=>{    
    
    const data=await models.ebook.findOne({
        include:[{
            model:models.user,
            required:false,
            attributes:['fullname']
        }],
        where:{
            id:parseInt(req.params.id)   
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

module.exports={index,readOne};