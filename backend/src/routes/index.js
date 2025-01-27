const exp=require('express')
const adminFilter=__require("middleware/adminFilter")
const writerFilter=__require("middleware/writerFilter")
const memberFilter=__require("middleware/memberFilter")
class WriterRouter{
    constructor(){
        this.router=exp.Router()
        this.article=__require("controllers/writer/article")
        this.ebook=__require("controllers/writer/ebook")
        this.home=__require("controllers/writer/home")
        this.contact=__require("controllers/writer/contact")
        this.personal=__require("controllers/writer/personal")        
        this.router.use(writerFilter)
        this.router.use("/personal",this.personalRoute())
        this.router.use("/contact",this.contactRoute())
        this.router.use("/",this.homeRoute())
        this.router.use("/article",this.articleRoute())
        this.router.use("/ebook",this.ebookRoute())
    }
    personalRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.personal.index)
        route.put('/update-data',this.personal.updateData)
        route.put('/update-password',this.personal.updatePassword)
        route.delete('/delete-session/:id',this.personal.deleteSession)
        return route
    }
    contactRoute=()=>{
        let route=exp.Router();
        route=exp.Router();
        route.get('/',this.contact.index)
        route.get('/:id',this.contact.readOne)
        route.delete('/:id',this.contact.del)
        route.post('/',this.contact.create)
        route.put('/:id',this.contact.update)
        return route
    }
    homeRoute=()=>{
        let route=exp.Router();
        route=exp.Router();
        route.get('/',this.home.index)
        return route
    }
    articleRoute=()=>{
        let route=exp.Router();
        route.get('/',this.article.index)
        route.get('/publish/:id',this.article.publish)
        route.get('/unpublish/:id',this.article.unpublish)
        route.get('/prev/:id',this.article.prevOne)
        route.get('/:id',this.article.readOne)
        route.delete('/:id',this.article.del)
        route.post('/',this.article.create)
        route.put('/:id',this.article.update)
        return route
    }
    ebookRoute=()=>{
        let route=exp.Router();
        route.get('/',this.ebook.index)
        route.get('/:id',this.ebook.readOne)
        route.delete('/:id',this.ebook.del)
        route.post('/',this.ebook.create)
        route.put('/:id',this.ebook.update)
        return route
    }
}

class MemberRouter{
    constructor(){
        this.router=exp.Router()
        this.comment=__require("controllers/member/comment")       
        this.router.use(memberFilter)
        this.router.use("/comment",this.commentRoute())
    }
    commentRoute=()=>{
        let route=exp.Router();        
        route.post('/send-comment/:id',this.comment.sendComment)
        route.delete('/delete-comment/:id',this.comment.deleteComment)
        route.delete('/delete-reply/:id',this.comment.deleteReply)
        route.post('/send-reply/:id',this.comment.sendReply)
        return route
    }
}

class AdminRouter{
    constructor(){
        this.router=exp.Router()
        this.user=__require("controllers/admin/user")
        this.config=__require("controllers/admin/config")
        this.staff=__require("controllers/admin/staff")
        this.category=__require("controllers/admin/category")
        this.article=__require("controllers/admin/article")
        this.ebook=__require("controllers/admin/ebook")
        this.home=__require("controllers/admin/home")
        this.contact=__require("controllers/admin/contact")
        this.personal=__require("controllers/admin/personal")        
        this.router.use(adminFilter)
        this.router.use("/user",this.userRoute())
        this.router.use("/personal",this.personalRoute())
        this.router.use("/contact",this.contactRoute())
        this.router.use("/config",this.configureRoute())
        this.router.use("/home",this.homeRoute())
        this.router.use("/staff",this.staffRoute())
        this.router.use("/article",this.articleRoute())
        this.router.use("/category",this.categoryRoute())
        this.router.use("/ebook",this.ebookRoute())
    }
    userRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.user.index)
        route.get('/:id',this.user.readOne)
        route.put('/update-password/:id',this.user.updatePassword)
        return route
    }
    personalRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.personal.index)
        route.put('/update-data',this.personal.updateData)
        route.put('/update-password',this.personal.updatePassword)
        route.delete('/delete-session/:id',this.personal.deleteSession)
        return route
    }
    contactRoute=()=>{
        let route=exp.Router();
        route=exp.Router();
        route.get('/:staff_id',this.contact.index)
        route.get('/:staff_id/:id',this.contact.readOne)
        route.delete('/:id',this.contact.del)
        route.post('/:staff_id',this.contact.create)
        route.put('/:id',this.contact.update)
        return route
    }
    configureRoute=()=>{
        let route=exp.Router();
        route=exp.Router();        
        route.get('/',this.config.index)
        route.put('/',this.config.update)
        return route
    }
    homeRoute=()=>{
        let route=exp.Router();
        route=exp.Router();
        route.get('/',this.home.index)
        return route
    }
    staffRoute=()=>{
        let route=exp.Router();
        route.get('/',this.staff.index)
        route.get('/:id',this.staff.readOne)
        route.delete('/:id',this.staff.del)
        route.post('/',this.staff.create)
        route.put('/update-data/:id',this.staff.update)
        route.put('/update-password/:id',this.staff.updatePassword)
        return route
    }    
    articleRoute=()=>{
        let route=exp.Router();        
        route.get('/',this.article.index)     
        route.get('/:id',this.article.readOne)   
        route.get('/prev/:id',this.article.prevOne)
        route.get('/publish/:id',this.article.publish)
        route.get('/unpublish/:id',this.article.unpublish)
        route.delete('/:id',this.article.del)
        route.post('/',this.article.create)
        route.post('/upload-image',this.article.uploadImage)
        route.delete('/delete-image/:img',this.article.deleteImage)
        
        route.put('/:id',this.article.update)
        route.put('/:id',this.article.update)
        return route
    }    
    categoryRoute=()=>{
        let route=exp.Router();
        route.get('/',this.category.index)
        route.get('/select2',this.category.select2)
        route.get('/:id',this.category.readOne)
        route.delete('/:id',this.category.del)
        route.post('/',this.category.create)
        route.put('/:id',this.category.update)
        return route
    }    
    ebookRoute=()=>{
        let route=exp.Router();
        route.get('/',this.ebook.index)
        route.get('/:id',this.ebook.readOne)
        route.delete('/:id',this.ebook.del)
        route.post('/',this.ebook.create)
        route.put('/:id',this.ebook.update)
        return route
    }
}

class PublicRouter{
    constructor(){
        this.router=exp.Router()
        this.staff=__require("controllers/public/staff")
        this.category=__require("controllers/public/category")
        this.article=__require("controllers/public/article")
        this.ebook=__require("controllers/public/ebook")
        this.home=__require("controllers/public/home")
        this.select2=__require("controllers/public/select2")
        this.contact=__require("controllers/public/contact")
        this.router.use("/contact",this.contactRoute())
        this.router.use("/",this.homeRoute())
        this.router.use("/staff",this.staffRoute())
        this.router.use("/article",this.articleRoute())
        this.router.use("/category",this.categoryRoute())
        this.router.use("/ebook",this.ebookRoute())
        this.router.use("/select2",this.select2Router())
    }
    contactRoute=()=>{
        let route=exp.Router();
        route.get('/',this.contact.index)
        route.get('/:id',this.contact.readOne)
        return route
    }
    homeRoute=()=>{
        let route=exp.Router();
        route.get('/',this.home.index)
        route.get('/check-user',this.home.checkUser)
        route.get('/check-notification',this.home.checkNotification)
        route.get('/read-notification',this.home.readNotification)
        route.get('/read-all-notification',this.home.readAllNotification)
        route.post("/login",this.home.login)
        route.get("/github-login",this.home.githubLogin)
        route.get("/logout",this.home.logout)
        return route
    }
    staffRoute=()=>{
        let route=exp.Router();
        route.get('/',this.staff.index)
        route.get('/:id',this.staff.readOne)
        return route
    }    
    articleRoute=()=>{
        let route=exp.Router();
        route.get('/',this.article.index)
        route.get('/:id',this.article.readOne)
        route.get('/read-comment/:article',this.article.readComment)
        return route
    }    
    categoryRoute=()=>{
        let route=exp.Router();
        route.get('/',this.category.index)
        route.get('/:id',this.category.readOne)
        return route
    }
    select2Router=()=>{
        let route=exp.Router();
        route.get('/category',this.select2.category)
        return route
    }    
    ebookRoute=()=>{
        let route=exp.Router();
        route.get('/',this.ebook.index)
        route.get('/:id',this.ebook.readOne)
        return route
    }
}
const route=exp.Router();
const admin_router=new AdminRouter();
const public_router=new PublicRouter();
const writer_router=new WriterRouter();
const member_router=new MemberRouter();
route.use("/admin",admin_router.router);
route.use("/writer",writer_router.router);
route.use("/member",member_router.router);
route.use("/",public_router.router);

route.all("*",(req,res)=>{
    return res.status(404).json({code:404,status:'error','message':"NOT FOUND"})
})
module.exports=route;