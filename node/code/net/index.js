var http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {'Cnotent-Type': 'text/plain'});
    res.end('hello wold\n')
}).listen(1337,'127.0.0.1');
