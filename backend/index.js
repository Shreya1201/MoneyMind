const http = require('http');
const dotenv = require('dotenv');
const { getUsers } = require('./db'); 
dotenv.config();
const server = http.createServer(async(req, res) =>{
  if(req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const users = await getUsers();
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});

const port = process.env.PORT;

server.listen(port,()=>{
    console.log(`Node.js HTTP server is running on port ${port}`);
})