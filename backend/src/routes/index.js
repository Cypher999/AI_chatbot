const exp=require('express')
const adminFilter=__require("middleware/adminFilter")
const userFilter=__require("middleware/userFilter")
class AdminRouter{
    constructor(){
        this.router=exp.Router()
        this.home=__require("controllers/admin/home")
        this.botType=__require("controllers/admin/botType")
        this.knowledge=__require("controllers/admin/knowledge")            
        this.router.use(adminFilter)
        this.router.use("/home",this.homeRoute())
        this.router.use("/bot-type",this.botTypeRoute())
        this.router.use("/knowledge",this.knowledgeRoute())
    }
    homeRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.home.index)
        return route
    }
    botTypeRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.botType.index)
        route.get('/:id',this.botType.getOne)
        route.post('/',this.botType.create)
        route.put('/:id',this.botType.update)
        route.put('/enable/:id',this.botType.enableBot)
        route.put('/disable/:id',this.botType.disableBot)
        route.delete('/:id',this.botType.del)
        return route
    }
    knowledgeRoute=()=>{
        let route=exp.Router();        
        route.get('/:botTypeId',this.knowledge.index)
        route.get('/:botTypeId/:id',this.knowledge.getOne)
        route.post('/:botTypeId',this.knowledge.create)
        route.put('/:botTypeId/:id',this.knowledge.update)
        route.delete('/:botTypeId/:id',this.knowledge.del)
        return route
    }
}

class PublicRouter{
    constructor(){
        this.router=exp.Router()
        this.botType=__require("controllers/public/botType")
        this.chat=__require("controllers/public/chat")
        this.auth=__require("controllers/public/auth")
        this.router.use("/bot-type",this.botTypeRoute())
        this.router.use("/chat",this.chatRoute())
        this.router.use("/auth",this.authRoute())
    }
    botTypeRoute=()=>{
        let route=exp.Router();
        route.get('/',this.botType.index)
        route.get('/:id',this.botType.getOne)
        return route
    }
    chatRoute=()=>{
        let route=exp.Router();
        route.post('/:botTypeId',this.chat.index)
        return route
    }  
    authRoute=()=>{
        let route=exp.Router();
        route.post('/',this.auth.login)
        return route
    }   
}
const route=exp.Router();
const admin_router=new AdminRouter();
const public_router=new PublicRouter();

route.use("/admin",admin_router.router);
route.use("/",public_router.router);

route.all("*",(req,res)=>{
    return res.status(404).json({code:404,status:'error','message':"NOT FOUND"})
})
module.exports=route;