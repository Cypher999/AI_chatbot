const fs = require('fs');
async function uploads(files,  destination) {
  let pathLama = files.filepath;
  let pathBaru = destination;
  let rawData = fs.readFileSync(pathLama);
  return new Promise((resolve, reject) => {
    fs.writeFile(pathBaru, rawData, function (err) {
      if (err) return reject(err);
      return resolve("Successfully uploaded")
    })
  });
}

module.exports =uploads;