/* const fs = require("fs");

let data = "";
let readerStream = fs.createReadStream("./compress.js");

readerStream.setEncoding("UTF8");
readerStream.on("data", chunk => (data += chunk));

readerStream.on("end", () => console.log(data));
readerStream.on("error", err => console.log(err));
console.log("程序执行完毕"); */


const fs = require('fs');
const readStream = fs.createReadStream('./compress.js');
const writeStream = fs.createWriteStream('./dest.js');
readStream.on('data', chunk => {
  if(writeStream.write(chunk) === false) {
    readStream.pause();
  }
});

writeStream.on('drain', () => readStream.resume());
readStream.on('end', () => writeStream.end());