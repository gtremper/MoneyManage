/** Index and views **/

exports.index = function(req,res){
  res.sendfile('index.html');
};

exports.views = function(req,res){
  var name = req.params.name;
  res.sendfile('views/'+name);
};
