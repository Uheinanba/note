var fs = require("fs");
var rs = fs.createReadStream("test.md");
var data = "";
rs.on("data", function(thunk) {
  data += thunk;
});
rs.on("end", function() {
  console.log(data);
});
