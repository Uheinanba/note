const fs = require("fs");

let data = "";
let readerStream = fs.createReadStream("./compress.js");

readerStream.setEncoding("UTF8");
readerStream.on("data", chunk => (data += chunk));

readerStream.on("end", () => console.log(data));
readerStream.on("error", err => console.log(err));
console.log("程序执行完毕");
