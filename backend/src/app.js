const exp=require('express')
const path=require('path');
const app=exp();
const port=process.env.APP_PORT || 8080;
const routes=require("./routes")
const cors=require('cors')
const parseToken=require('./middleware/parseToken');
const formParse = require('./middleware/formParse');
app.use(cors());
app.use(parseToken);
app.use(formParse);
app.set('trust proxy', true);
app.use("/file", exp.static(path.join(__dirname, "../files/docs")));
app.use("/img-user", exp.static(path.join(__dirname, "../files/images/user")));
app.use("/img-article", exp.static(path.join(__dirname, "../files/images/article")));
app.use("/img-pages", exp.static(path.join(__dirname, "../files/images/pages")));
app.use("/img-ebook", exp.static(path.join(__dirname, "../files/images/ebook")));
app.use("/img-config", exp.static(path.join(__dirname, "../files/images/config")));
app.use('/',routes)
module.exports=app;
