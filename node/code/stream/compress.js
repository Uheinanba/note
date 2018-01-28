const fs = require("fs");
const zlib = require("zlib");
fs
  .createReadStream("./stream.md")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("stream.md.gz"));
console.log("压缩完成");
