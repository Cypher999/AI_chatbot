const exp=require('express')
const adminFilter=__require("middleware/adminFilter")
const userFilter=__require("middleware/userFilter")

// class UserRouter{
//     constructor(){
//         this.router=exp.Router()
//         this.botType=__require("controllers/user/botType")
//         this.knowledge=__require("controllers/user/knowledge")
//         this.chat=__require("controllers/user/chat")
//         this.personal=__require("controllers/user/personal")        
//         this.router.use(userFilter)
//         this.router.use("/user",this.userRoute())
//         this.router.use("/personal",this.personalRoute())
//         this.router.use("/bot-type",this.botTypeRoute())
//         this.router.use("/home",this.homeRoute())
//         this.router.use("/chat",this.chatRoute())
//         this.router.use("/knowledge",this.knowledgeRoute())
//     }
//     personalRoute=()=>{
//         let route=exp.Router();        
//         route.get('/',this.personal.index)
//         route.put('/update-data',this.personal.updateData)
//         route.put('/update-password',this.personal.updatePassword)
//         return route
//     }
//     botTypeRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();
//         route.get('/',this.botType.index)
//         route.get('/:id',this.botType.readOne)
//         route.delete('/:id',this.botType.del)
//         route.post('/',this.botType.create)
//         route.put('/:id',this.botType.update)
//         return route
//     }
//     chatRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();        
//         route.post('/',this.chat.index)
//         return route
//     }
//     homeRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();
//         route.get('/',this.home.index)
//         return route
//     } 
//     knowledgeRoute=()=>{
//         let route=exp.Router();        
//         route.get('/',this.knowledge.index)     
//         route.get('/:id',this.knowledge.readOne)
//         route.delete('/:id',this.knowledge.del)
//         route.post('/',this.knowledge.create)
//         route.put('/:id',this.knowledge.update)
//         return route
//     }    
// }

// class AdminRouter{
//     constructor(){
//         this.router=exp.Router()
//         this.user=__require("controllers/admin/user")
//         this.botType=__require("controllers/admin/botType")
//         this.knowledge=__require("controllers/admin/knowledge")
//         this.chat=__require("controllers/admin/chat")
//         this.personal=__require("controllers/admin/personal")        
//         this.router.use(adminFilter)
//         this.router.use("/user",this.userRoute())
//         this.router.use("/personal",this.personalRoute())
//         this.router.use("/bot-type",this.botTypeRoute())
//         this.router.use("/home",this.homeRoute())
//         this.router.use("/chat",this.chatRoute())
//         this.router.use("/knowledge",this.knowledgeRoute())
//     }
//     userRoute=()=>{
//         let route=exp.Router();        
//         route.get('/',this.user.index)
//         route.get('/:id',this.user.readOne)
//         route.put('/update-password/:id',this.user.updatePassword)
//         return route
//     }
//     personalRoute=()=>{
//         let route=exp.Router();        
//         route.get('/',this.personal.index)
//         route.put('/update-data',this.personal.updateData)
//         route.put('/update-password',this.personal.updatePassword)
//         return route
//     }
//     botTypeRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();
//         route.get('/',this.botType.index)
//         route.get('/:id',this.botType.readOne)
//         route.delete('/:id',this.botType.del)
//         route.post('/',this.botType.create)
//         route.put('/:id',this.botType.update)
//         return route
//     }
//     chatRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();        
//         route.post('/',this.chat.index)
//         return route
//     }
//     homeRoute=()=>{
//         let route=exp.Router();
//         route=exp.Router();
//         route.get('/',this.home.index)
//         return route
//     } 
//     knowledgeRoute=()=>{
//         let route=exp.Router();        
//         route.get('/',this.knowledge.index)     
//         route.get('/:id',this.knowledge.readOne)
//         route.delete('/:id',this.knowledge.del)
//         route.post('/',this.knowledge.create)
//         route.put('/:id',this.knowledge.update)
//         return route
//     }    
// }

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
// const admin_router=new AdminRouter();
const public_router=new PublicRouter();
// const user_router=new UserRouter();
// route.use("/admin",admin_router.router);
// route.use("/user",user_router.router);
route.use("/",public_router.router);

route.all("*",(req,res)=>{
    return res.status(404).json({code:404,status:'error','message':"NOT FOUND"})
})
module.exports=route;