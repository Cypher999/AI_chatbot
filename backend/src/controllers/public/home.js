const exp=require('express')
const models=__require("db/models/");
const hashPassword=__require("thirdparty/hashPassword");
const GAT=__require('thirdparty/generateAccessToken');
const joi=require('joi');
const generateRandom=__require("thirdparty/generateRandom")
const {dateParse}=__require("thirdparty/dateParse")
const moment=require('moment')
const {literal}=require('sequelize')
const { Op } = require('sequelize'); 
const axios =require('axios');
const secret_key=process.env.GOOGLE_CAPTCHA_SECRETKEY;
const dateDiff=__require("thirdparty/dateDiff");
const index=async (req,res)=>{
    const config=await models.config.findAll({
        attributes:['name','about_us']
    });
    if(__existSync('files/images/config/banner-img.jpg')){
        if(config.length<=0){
            config.push({
                dataValues:{_banner:__base_url('img-config/banner-img.jpg')}
            })
        }
        else{
            config[0].dataValues._banner=__base_url('img-config/banner-img.jpg');
        }
    }
    if(__existSync('files/images/config/logo.png')){
        if(config.length<=0){
            config.push({
                dataValues:{_logo:__base_url('img-config/logo.png')}
            })
        }
        else{
            config[0].dataValues._logo=__base_url('img-config/logo.png');
        }
    }
    let staff=await models.staff.findAll({
        include:{
            model:models.user,
            attributes:["fullname","img"]
        },
        attributes:['short_bio','id']
    });
    let newArticle=await models.article.findAll({
        limit:1,
        offset:0,
        order:[
            ['date_created','DESC']
        ],
        attributes:[
            'date_created','title','img'
        ],
        include:{
            model:models.user,
            attributes:['fullname']
        }
    }        
    );
    let randomArticle = await models.article.findAll({
        order: literal('RAND()'), // Random order
        limit: 3,
        attributes:[
            'date_created','title','img'
        ],
        include:{
            model:models.user,
            attributes:['fullname']
        },
        order: [['date_created', 'DESC']],
        where:
        newArticle.length>0
        ?{
            title:{[Op.ne]:newArticle[0].dataValues.title},
            publish:1
        }
        :{publish:1}
        });
    randomArticle=randomArticle.map(item=>{
        if(__existSync('files/images/article/'+item.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-article/'+item.dataValues.img+".jpg");
        }
        item.dataValues._date_created=dateParse(item.dataValues.date_created);
        item.dataValues._slug=item.dataValues.title.replace(/ /g,"-");
        return item;
    });
    
    if(newArticle.length>0){
        if(__existSync('files/images/article/'+newArticle[0].dataValues.img+".jpg")){
            newArticle[0].dataValues._img=__base_url('img-article/'+newArticle[0].dataValues.img+".jpg");
        }
        newArticle[0].dataValues._date_created=dateParse(newArticle[0].dataValues.date_created);
        newArticle[0].dataValues._slug=newArticle[0].dataValues.title.replace(/ /g,"-");
    }
    staff=staff.map(item=>{
        if(__existSync('files/images/user/'+item.dataValues.user.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-user/'+item.dataValues.user.dataValues.img+".jpg");
        }
        else{
            item.dataValues._img=__base_url('img-user/man.jpg');
        }
        return item;
    });

    let newEBook=await models.ebook.findAll({
        limit:1,
        offset:0,
        order:[
            ['date_created','DESC']
        ],
        attributes:[
            'date_created','name','link','img'
        ],
        include:{
            model:models.user,
            attributes:['fullname']
        }
    }        
    );
    let randomEBook = await models.ebook.findAll({
        order: literal('RAND()'), // Random order
        limit: 3,
        order: [['date_created', 'DESC']],
        attributes:[
            'date_created','link','name','img'
        ],
        include:{
            model:models.user,
            attributes:['fullname']
        },
        where:
        newEBook.length>0
        ?{
            name:{[Op.ne]:newEBook[0].dataValues.name}
        }
        :{}
        });
    randomEBook=randomEBook.map(item=>{
        if(__existSync('files/images/ebook/'+item.dataValues.img+".jpg")){
            item.dataValues._img=__base_url('img-ebook/'+item.dataValues.img+".jpg");
        }
        item.dataValues._date_created=dateParse(item.dataValues.date_created);
        return item;
    });
    
    if(newEBook.length>0){
        if(__existSync('files/images/ebook/'+newEBook[0].dataValues.img+".jpg")){
            newEBook[0].dataValues._img=__base_url('img-ebook/'+newEBook[0].dataValues.img+".jpg");
        }
        newEBook[0].dataValues._date_created=dateParse(newEBook[0].dataValues.date_created);
        
    }

    return res.status(200).json({code:200,status:'success',data:{config,staff,newArticle,randomArticle,newEBook,randomEBook}});
    

    
}

const login=async (req,res)=>{
    const validator = joi.object({
        username: joi.string()
          .required()
          .messages({
            'any.required': 'Username is a required field'
          }),
        password:joi.string() 
          .required()
          .messages({
            'any.required': 'Password is a required field'
          }),
        captcha:joi.string() 
          .required()
          .messages({
            'any.required': 'Please check the captcha'
          })
      });
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({code:500, status:'error',message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const token=req.body.captcha;
    
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`);
    const data = response.data;
    if (data.success) {
      // reCAPTCHA was successful
      
    } else {
      // reCAPTCHA failed
      return res.status(500).json({code:500,status:'error','message':'reCAPTCHA verification failed. Please try again.'});
    }
    const user=await models.user.findOne({
        where:{
            'username':req.body.username
        },
        attributes:['id','username','password']
        });
        if(user){
            if(user.dataValues.password){
                const checkPassword=await hashPassword.verifyPassword(req.body.password,user.dataValues.password);
                if(checkPassword){
                    const checkSession=await models.login_session.findAll({
                        where:{
                            user_id:user.dataValues.id,
                            device:req.headers['user-agent'],
                            ip:req.ip
                        }
                    });
                    if(checkSession.length<=0){
                        let userKey=generateRandom(10);
                        let objectTimeNow=new Date();
                        await models.login_session.create({
                            userkey:userKey,
                            device:req.headers['user-agent'],
                            ip:req.ip,
                            user_id:user.dataValues.id,
                            created_at:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds()
                        })
                        const token=GAT({userkey:userKey});
                        return res.status(200).json({"code":200,'status':'success','data':{token}});
                    }
                    else{
                        let userKey=generateRandom(10);
                        let objectTimeNow=new Date();
                        await models.login_session.update({
                            userkey:userKey,
                            device:req.headers['user-agent'],
                            ip:req.ip,
                            created_at:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds()
                        },{
                            where:{
                                id:checkSession[0].id
                            }
                        })
                        const token=GAT({userkey:userKey});
                        return res.status(200).json({"code":200,'status':'success','data':{token}});
                    }          
                }
                else{
                    return res.status(500).json({'code':500,'status':'error','message':[{password:'password is incorrect'}]})
                }
            }
        }
    return res.status(500).json({'code':500,'status':'error','message':[{username:'username not found'}]})
}

const logout=async (req,res)=>{
    if(req.user_key){
        const session=await models.login_session.findOne({
            where:{
                'userkey':req.user_key
            },
            attributes:['id']
        });
        if(session){
            const del=await models.login_session.findByPk(session.id);
            del.destroy();
            return res.status(200).json({'code':200,'status':'success','message':'logout successfull'})
        }
    }
    
    return res.status(404).json({'code':404,'status':'error','message':'username not found'})
}

const checkUser=async (req,res)=>{
    const data=await models.user.findOne({
        where:{
            id:req.user_id
        },
        attributes:["fullname","img","type"]
    });
    if(data!=null){
        if(data.dataValues.type!="G"){
            if(__existSync('files/images/user/'+data.dataValues.img+".jpg")){
                data.dataValues._img=__base_url('img-user/'+data.dataValues.img+".jpg");
            }
            else{
                data.dataValues._img=__base_url("img-user/man.jpg");
            }
        }
        else{
            data.dataValues._img=data.dataValues.img;
        }
        return res.status(200).json({'code':200,'status':'success',data:{...data.dataValues}});
    }
    else{
        return res.status(200).json({'code':200,'status':'success',data:{type:"P"}});
    }
    
}

const githubLogin=async (req, res) => {
    const authCode = req.query.code;
    console.log('Authorization Code:', authCode);
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
        }, {
            headers: {
                Accept: 'application/json' // To receive JSON response
            }
        });
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${response.data.access_token}`
            }
        });
        const checkUsername=await models.user.count({
            where:{
                'username':userResponse.data.id
            }
        });
        let user_id=0;
        if(checkUsername<=0){
            let createUser=await models.user.create({
                username:userResponse.data.id,
                fullname:userResponse.data.login,
                img:userResponse.data.avatar_url,
                type:'G'
            });
            user_id=createUser.id
        }
        else{
            const readUser=await models.user.findOne({
                where:{
                    'username':userResponse.data.id
                }
            });
            user_id=readUser.dataValues.id;

        }
        const checkSession=await models.login_session.findAll({
            where:{
                user_id:user_id,
                device:req.headers['user-agent'],
                ip:req.ip
            }
        });
        if(checkSession.length<=0){
            let userKey=generateRandom(10);
            let objectTimeNow=new Date();
            await models.login_session.create({
                userkey:userKey,
                device:req.headers['user-agent'],
                ip:req.ip,
                user_id:user_id,
                created_at:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds()
            })
            const token=GAT({userkey:userKey});
            return res.redirect(process.env.FRONTEND_URL+"?token="+token);
        }
        else{
            let userKey=generateRandom(10);
            let objectTimeNow=new Date();
            await models.login_session.update({
                userkey:userKey,
                device:req.headers['user-agent'],
                ip:req.ip,
                created_at:objectTimeNow.getFullYear()+"-"+(parseInt(objectTimeNow.getMonth())+1)+"-"+objectTimeNow.getDate()+" "+objectTimeNow.getHours()+":"+objectTimeNow.getMinutes()+":"+objectTimeNow.getSeconds()
            },{
                where:{
                    id:checkSession[0].id
                }
            })
            const token=GAT({userkey:userKey});
            return res.redirect(process.env.FRONTEND_URL+"?token="+token);
        } 
        // return res.status(200).json({
        //     code:200,
        //     status:"success",
        //     data:{
        //         id:userResponse.data.id,
        //         username:userResponse.data.login,
        //         image:userResponse.data.avatar_url
        //     }
        // })
    } catch (error) {
        console.error('Error exchanging code for access token:', error);
        res.status(500).send('Error exchanging code for access token');
    }
}

const checkNotification=async (req,res)=>{
    const data=await models.notification.count({
        where:{
            user_to:req.user_id,
            read:0
        },
    });
    return res.status(200).json({'code':200,'status':'success',data:data});    
}
const readNotification=async (req,res)=>{
    const data=await models.notification.findAll({
        where:{
            user_to:req.user_id,
            read:0
        },
        order:[['date_created','DESC']],
        attributes:["message","quick_link",'date_created']
    });
    data.forEach((item)=>{
        dateDifference=dateDiff.dateDiffNow(
            item.dataValues.date_created
        )
        item.dataValues.quick_link=item.dataValues.quick_link.replace("{{BASE_URL}}",process.env.FRONTEND_URL)
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
    })
    await models.notification.update({
        read:1
    },{
        where:{
            read:0,
            user_to:req.user_id,
        }
    })
    return res.status(200).json({'code':200,'status':'success',data});    
}
const readAllNotification=async (req,res)=>{
    const data=await models.notification.findAll({
        where:{
            user_to:req.user_id,
        },
        order:[['date_created','DESC']],
        attributes:["message","quick_link",'date_created']
    });
    data.forEach((item)=>{
        dateDifference=dateDiff.dateDiffNow(
            item.dataValues.date_created
        )
        item.dataValues.quick_link=item.dataValues.quick_link.replace("{{BASE_URL}}",process.env.FRONTEND_URL)
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
    })
    await models.notification.update({
        read:1
    },{
        where:{
            read:0,
            user_to:req.user_id,
        }
    })
    return res.status(200).json({'code':200,'status':'success',data});    
}
module.exports={index,readAllNotification,checkNotification,readNotification,login,logout,checkUser,githubLogin};