var fs = require('fs');

exports.index = function(req, res){
  var indexContent=fs.readFileSync("./public/index.html");
  res.writeHead(200,{"Content-Type":"text/html"});
  res.write(indexContent);
  res.end();
};