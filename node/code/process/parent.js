const child_process = require("child_process");
const spawn = child_process.spawn;
const exec = child_process.exec;
const fs = require("fs");
// console.log(process.argv);

fs.createReadStream(__filename).pipe(process.stdout);
// process.stdout.write("hello" + "\n");
