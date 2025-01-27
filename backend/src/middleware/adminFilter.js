const jwt = require('jsonwebtoken');
const models=__require("db/models/index");
module.exports = async (req, res, next) => {
  if(req.user_type=="A"){
    next();
  }
  else{
    return res.status(404).json({code:404,status:'error','message':'not found'})
  }
  

}