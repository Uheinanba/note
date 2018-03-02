var http = require("http");
var server = new http.Server();
server
  .on("request", (req, res) => {
    res.writeHead(200, {
      "content-type": "text/plain"
    });
    res.write("hello nodejs");
    res.end();
  })
  /* 
http
  .createServer((req, res) => {
    res.writeHead(200, {
      "content-type": "text/plain"
    });
    res.write("hello");
    res.end();
  }) */
  .listen(3000);
