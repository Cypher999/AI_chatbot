require('dotenv').config()
//for custom global function
const port=process.env.APP_PORT;
const fs=require('fs');
global.__require = function (file) {
    return require(__dirname + '/src/' + file)
}
global.__existSync=function(file){
    return fs.existsSync(__dirname+'/'+file);
}
global.__unlinkSync = function (file) {
    return fs.unlinkSync(__dirname + '/' + file);
}
global.__base_url=function(url=""){
    return process.env.BASE_URL+url;
}
//
const app=require('./src/app')

app.listen(port,"0.0.0.0",()=>{
    console.log('server run on '+port)
});