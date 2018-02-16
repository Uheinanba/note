const fs = require("fs");
const child_process = require("child_process");
const spawn = child_process.spawn;
const exec = child_process.exec;

/* exec("cat parent.js", function(err, stdout, stdin) {
  console.log(stdout);
});
 */
if (process.argv[2] === "child") {
  console.log("i am inside the child", process.argv);
} else {
  var child = spawn(process.execPath, [__filename, "child"], {
    stdio: "inherit"
  });
  // child.stdout.pipe(process.stdout);
  /* child.stdout.on("data", function(data) {
    console.log("from child", data.toString());
  }); */
}
