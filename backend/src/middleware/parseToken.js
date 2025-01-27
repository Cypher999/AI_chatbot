const jwt = require('jsonwebtoken');
const models=__require("db/models/index");
const {Op}=require('sequelize')
module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader) {
    const token = authHeader.split(" ")[1]; 
    if(token){
      jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {      
        if (err) {
          console.log(err)
          req.user_id="";
          req.user_type = 'P';
        }
        else {
          let login_session = await models.login_session.findOne({
              where:{
                userkey:data.userkey,
                device:req.headers['user-agent'],
                ip:req.ip
              }
          });
          if(login_session){
            let user = await models.user.findByPk(login_session.dataValues.user_id);
            req.user_id=user.dataValues.id;
            req.user_key=data.userkey;
            req.user_type = user.dataValues.type;
          }
          else{
            req.user_id="";
            req.user_type = "P";
          }
          
        }
        next();
      })
    }
    else {
      req.user_id="";
      req.user_type = 'P';
      next();
    }
  }
  else {
    req.user_id="";
    req.user_type = 'P';
    next();
  }


}