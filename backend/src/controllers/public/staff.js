const exp=require('express')
const route=exp.Router();
const models=__require("db/models/");
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const uploads=__require("thirdparty/uploads")
const { Op } = require('sequelize'); 
const hashPassword=__require("thirdparty/hashPassword")
const index=async (req,res)=>{
    
    const limit=10;
    const page=req.query.page?parseInt(req.query.page)-1:0;
    const offset=page*10;
    
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
            include:[{
                model:models.user,
                required:true,
                attributes:['fullname','img']
            },
            {
                model:models.contact,
                required:false,
                attributes:['icon','link']
            }
            ],
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
            include:[{
                model:models.user,
                required:true,
                attributes:['fullname','img']
            },
            {
                model:models.contact,
                required:false,
                attributes:['icon','link']
            }
            ]
        })
        maxPage=maxPage>0?Math.ceil(parseInt(maxPage)/limit):0;
        
    }
    else{
        data=await models.staff.findAll({
            include:[{
                model:models.user,
                required:true,
                attributes:['fullname','img']
            },
            {
                model:models.contact,
                required:false,
                attributes:['icon','link']
            }
            ],
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
        else{
            item.dataValues._img=__base_url('img-user/man.jpg');
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
            attributes:['fullname','img']
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
        else{
            data.dataValues._img=__base_url('img-user/man.jpg');
        }
    }
    return res.status(200).json({code:200,status:'success',data});
}
module.exports={index,readOne};