const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  req.user_id="";
  req.user_role = 'public';
  if (authHeader) {
    const token = authHeader.split(" ")[1]; 
    if(token){
      jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
          console.log(err)
        }
        else {
          req.user_id=data.user_id;
          req.user_role = data.user_role;        
        }
        next();
      })
    }
  }
  else{
    next()
  }
}