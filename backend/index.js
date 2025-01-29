require('dotenv').config()
const port=process.env.APP_PORT;
const host=process.env.APP_HOST;
global.__require = function (file) {
    return require(__dirname + '/src/' + file)
}
global.__base_url=function(url=""){
    return process.env.BASE_URL+url;
}
//
const app=require('./src/app')

app.listen(port,host,()=>{
    console.log(`server run on http://${host}:${port}`)
});