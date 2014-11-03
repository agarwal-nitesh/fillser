


// app.get('/api/GET/dirs/:dirId',function(req,res){
// 	directoryModel.findOne({_id:req.params.dirId},'filesInDir._id', function(err,docs){
// 		if(err){
// 			res.end("error");
// 			return;
// 		}
// 		res.json(docs.filesInDir);
// 	});
// });

// app.get('/api/GET/:dirId/:fileId', function(req, res){
// 	directoryModel.findOne({_id:req.params.dirId},
// 		function(err, docFiles){
// 			var filesData = docFiles.filesInDir.id(req.params.fileId);
// 			res.writeHead(200, {"Content-Type":mime.lookup(filesData.id)});
// 			res.write(filesData.fileData);
// 			res.end();
// 	});
// });