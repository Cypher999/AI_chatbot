const formidable = require('formidable');

module.exports = (req, res, next) => {
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, (err, field, files) => {
    if (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
    let valBody = Object.values(field);
    let keyBody = Object.keys(field);
    let valFile = Object.values(files);
    let keyFile = Object.keys(files);
    valBody.forEach((n, i) => {
      if (n.length == 1) {
        field[keyBody[i]] = n[0];
      }
    });

    valFile.forEach((n, i) => {
      if (n.length == 1) {
        files[keyFile[i]] = n[0];
      }
    });
    req.body = field;
    req.files = files;
    next();
  })
}