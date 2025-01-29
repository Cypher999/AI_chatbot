const jwt = require('jsonwebtoken');
const getOne=__require('utils/db/users').getOne
module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];  
  if (authHeader) {
    const token = authHeader.split(" ")[1]; 
    if(token){
      jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {      
        if (err) {
          console.log(err)
          req.user_id="";
          req.user_role = 'public';
        }
        else {
          let user = await getOne(data.user_id);
            req.user_id=data.user_id;
            req.user_role = user.role;          
        }
        next();
      })
    }
    else {
      req.user_id="";
      req.user_role = 'P';
      next();
    }
  }
  else {
    req.user_id="";
    req.user_role = 'P';
    next();
  }
}