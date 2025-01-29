const exp=require('express')
const path=require('path');
const app=exp();
const routes=require("./routes")
const cors=require('cors')
// const parseToken=require('./middleware/parseToken');
const formParse = require('./middleware/formParse');
app.use(cors());
// app.use(parseToken);
app.use(formParse);
app.set('trust proxy', true);
app.use("/img-user", exp.static(path.join(__dirname, "../img/user")));
app.use('/',routes)

module.exports=app;
