const users=__require('utils/db/users')
const {verify}=__require('utils/hashPassword')
const joi=require('joi')
const jwt = require("jsonwebtoken");
const login=async (req,res)=>{
    const validator = joi.object({
        username: joi.string()
            .required()
            .messages({
            'any.required': 'Username is required'
            }),
        password: joi.string()
            .required()
            .messages({
            'any.required': 'Password is required'
            })
    });
    const { error } = validator.validate(req.body,{ abortEarly: false });
    if (error) {
        return res.status(500).json({
            code:500, 
            status:'error',
            message: error.details.map(detail => {return {[detail.path]:detail.message}}) });
    }
    const count=await users.count({username:req.body.username});
    if(count<=0) return res.status(500).json({status:'error','message':'username not found'}); 
    const data = await users.getOne({username:req.body.username});
    if (data) {
        const checkPassword=await verify(req.body.password,data.password);
        if(!checkPassword) return res.status(500).json({status:'error','message':'password doesnt match'});
        const accessToken= jwt.sign({
            user_id:data.id,
            user_role:data.role
        }, process.env.SECRET_KEY, { expiresIn: '30d' });
        return res.status(200).json({status:'success',data:{accessToken,role:data.role}})      
    } else {
        return res.status(500).json({status:'error','message':''});
    }
}

const checkUser=async (req,res)=>{
    if(req.user_id=="") return res.status(200).json({status:'success',data:{role:'public'}})  
    const id=parseInt(req.user_id)
    const data = await users.getOne({id});
    if (data) {
        data.password=null;
        return res.status(200).json({status:'success',data})      
    } else {
        return res.status(500).json({status:'error','message':''});
    }
}

module.exports={login,checkUser};