module.exports = async (req, res, next) => {
  if(req.user_role=="user"||req.user_role=="admin"){
    next();
  }
  else{
    return res.status(404).json({code:404,status:'error','message':'not found'})
  }
}