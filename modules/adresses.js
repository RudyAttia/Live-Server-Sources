var ifs = require('os').networkInterfaces();
var result = Object.keys(ifs)
  .map(x => [x, ifs[x].filter(x => x.family === 'IPv4')[0]])
  .filter(x => x[1])
  .map(x => x[1].address);
module.exports.ips = result.map( ip => `http://${ip}:4040`)