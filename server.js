// server.js listens to port 3000
// Responds to any requests from recipe service on localhost:3000
// app.js further processes requests

const http = require('http');
const app = require('./backend/app');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

