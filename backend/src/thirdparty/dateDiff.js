const moment = require('moment');
const dateDiffNow=(date)=>{
    date=moment(date);
    now=moment()
    const diffInDays = now.diff(date,"days");
    const diffInHours = now.diff(date,"hours");
    const diffInMinutes = now.diff(date,"minutes");
    const diffInSeconds = now.diff(date,"seconds");
    return {
        D:diffInDays,
        H:diffInHours,
        M:diffInMinutes,
        S:diffInSeconds
    }
}
module.exports={dateDiffNow}