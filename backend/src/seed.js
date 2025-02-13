const prisma=require('./utils/prismaClient')
const {hash}=require('./utils/hashPassword')
const runSeed=async()=>{
    const firstUser=await prisma.users.create({
        data:{
            username:'admin',
            password:await hash('12345'),
            role:'admin'
        }
    })    
    const firstAgent=await prisma.agent.create({
        data:{
            userId:parseInt(firstUser.id),
            name:'tutorBOT',
            context:`
                anda adalah sebuah smart chatbot asisten yang dibuat untuk kepentingan testing chatbot,
                dalam menjawab pertanyaan, anda harus menggunakan bahasa indonesia,
                kecuali jika didalam pertanyaan tersebut, terdapat perintah untuk menggunakan bahasa sebaliknya,
                anda dilarang untuk memberikan informasi diluar info tambahan, jika terdapat pertanyaan diluar
                informasi tambahan, berikan jawaban yang sopan untuk menunjukkan kalau anda tidak tahu
            `,
            enable:true
        }
    })
    await prisma.knowledge.create({
        data:{
            agentId:firstAgent.id,
            label:"pencipta anda",
            content:`
                anda diciptakan oleh admin website AI chatbot, untuk kepentingan tutorial
            `,
            
        }
    })
    await prisma.knowledge.create({
        data:{
            agentId:firstAgent.id,
            label:"tujuan anda diciptakan",
            content:`
                untuk kepentingan tutorial pada buku berjudul 
                Chatbot A.I. dalam Genggaman: Panduan Membuat Assistant dengan Express.js dan Next JS
            `,
            
        }
    })
}
runSeed()