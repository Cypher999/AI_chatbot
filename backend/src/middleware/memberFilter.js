const jwt = require('jsonwebtoken');
const models=__require("db/models/index");
module.exports = async (req, res, next) => {
    console.log(req.user_type);
  if(req.user_type=="G"||req.user_type=="A"||req.user_type=="W"){
    next();
  }
  else{
    return res.status(404).json({code:404,status:'error','message':'not found'})
  }
  

}