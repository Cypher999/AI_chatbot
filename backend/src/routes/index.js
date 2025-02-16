const exp=require('express')
const adminFilter=__require("middleware/adminFilter")
const userFilter=__require("middleware/userFilter")
class AdminRouter{
    constructor(){
        this.router=exp.Router()
        this.home=__require("controllers/admin/home")
        this.agent=__require("controllers/admin/agent")
        this.knowledge=__require("controllers/admin/knowledge")  
        this.user=__require("controllers/admin/user")
        this.personal=__require("controllers/admin/personal") 
        this.router.use(adminFilter)
        this.router.use("/home",this.homeRoute())
        this.router.use("/agent",this.agentRoute())
        this.router.use("/knowledge",this.knowledgeRoute())
        this.router.use("/personal",this.personalRoute())
        this.router.use("/user",this.userRoute())
    }
    homeRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.home.index)
        return route
    }
    agentRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.agent.index)
        route.get('/:id',this.agent.getOne)
        route.post('/',this.agent.create)
        route.put('/:id',this.agent.update)
        route.put('/enable/:id',this.agent.enableBot)
        route.put('/disable/:id',this.agent.disableBot)
        route.delete('/:id',this.agent.del)
        return route
    }
    personalRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.personal.index)
        route.put('/update-data',this.personal.updateData)
        route.put('/update-password',this.personal.updatePassword)
        return route
    }
    knowledgeRoute=()=>{
        let route=exp.Router();        
        route.get('/:agentId',this.knowledge.index)
        route.get('/:agentId/:id',this.knowledge.getOne)
        route.post('/:agentId',this.knowledge.create)
        route.put('/:agentId/:id',this.knowledge.update)
        route.delete('/:agentId/:id',this.knowledge.del)
        return route
    }
    userRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.user.index)
        route.get('/:id',this.user.getOne)
        route.post('/',this.user.create)
        route.put('/update-data/:id',this.user.updateData)
        route.put('/update-password/:id',this.user.updatePassword)
        route.delete('/:id',this.user.del)
        return route
    }
}

class UserRouter{
    constructor(){
        this.router=exp.Router()
        this.home=__require("controllers/user/home")
        this.agent=__require("controllers/user/agent")
        this.knowledge=__require("controllers/user/knowledge")  
        this.personal=__require("controllers/user/personal") 
        this.router.use(userFilter)
        this.router.use("/home",this.homeRoute())
        this.router.use("/agent",this.agentRoute())
        this.router.use("/knowledge",this.knowledgeRoute())
        this.router.use("/personal",this.personalRoute())
    }
    homeRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.home.index)
        return route
    }
    agentRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.agent.index)
        route.get('/:id',this.agent.getOne)
        route.post('/',this.agent.create)
        route.put('/:id',this.agent.update)
        route.put('/enable/:id',this.agent.enableBot)
        route.put('/disable/:id',this.agent.disableBot)
        route.delete('/:id',this.agent.del)
        return route
    }
    personalRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.personal.index)
        route.put('/update-data',this.personal.updateData)
        route.put('/update-password',this.personal.updatePassword)
        return route
    }
    knowledgeRoute=()=>{
        let route=exp.Router();        
        route.get('/:agentId',this.knowledge.index)
        route.get('/:agentId/:id',this.knowledge.getOne)
        route.post('/:agentId',this.knowledge.create)
        route.put('/:agentId/:id',this.knowledge.update)
        route.delete('/:agentId/:id',this.knowledge.del)
        return route
    }
}

class PublicRouter{
    constructor(){
        this.router=exp.Router()
        this.agent=__require("controllers/public/agent")
        this.chat=__require("controllers/public/chat")
        this.auth=__require("controllers/public/auth")
        this.router.use("/agent",this.agentRoute())
        this.router.use("/chat",this.chatRoute())
        this.router.use("/auth",this.authRoute())
    }
    agentRoute=()=>{
        let route=exp.Router();
        route.get('/',this.agent.index)
        route.get('/:id',this.agent.getOne)
        return route
    }
    chatRoute=()=>{
        let route=exp.Router();
        route.post('/:agentId',this.chat.index)
        return route
    }  
    authRoute=()=>{
        let route=exp.Router();
        route.get('/',this.auth.checkUser)
        route.post('/',this.auth.login)
        return route
    }   
}
const route=exp.Router();
const admin_router=new AdminRouter();
const public_router=new PublicRouter();
const user_router=new UserRouter();

route.use("/admin",admin_router.router);
route.use("/user",user_router.router);
route.use("/",public_router.router);

route.all("*",(req,res)=>{
    return res.status(404).json({code:404,status:'error','message':"NOT FOUND"})
})
module.exports=route;