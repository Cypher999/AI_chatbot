const month=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agus","Sep","Okt","Nov","Des"];
const days=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const dateParse=(date)=>{
    const waktu=new Date(date);
    return days[waktu.getDay()]+" "+waktu.getDate()+" "+month[waktu.getMonth()]+" "+waktu.getFullYear();
}
const timeParse=(date)=>{
    const waktu=new Date(date);
    return waktu.getHours()+":"+waktu.getMinutes()+":"+waktu.getSeconds()+" "+days[waktu.getDay()]+" "+waktu.getDate()+" "+month[waktu.getMonth()]+" "+waktu.getFullYear();
}
module.exports={
    dateParse,timeParse
}