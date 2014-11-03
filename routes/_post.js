/*jshint node:true
----Created By Nitesh Agarwal on 15/10/14. All rights reserved. Copyright (c) 2014 Nitesh. 
niteshagarwal1.618@gmail.com
*/
var busboy = require('connect-busboy'),
	fs = require('fs'),
	mongoose = require('mongoose');


var selectedDir = "";
var fileSchema = new mongoose.Schema({_id:String, fileName:String, fileURL:String});
var fileModel = mongoose.model('files', fileSchema);
var fileDataSchema = new mongoose.Schema({_id:String, fileData:Buffer, fileEnc:String, fileMime:String});
var fileDataModel = mongoose.model('fileData', fileDataSchema);
var subdirSchema = new mongoose.Schema({_id:String, dirName:String, filesInDir:[fileSchema]});
var subdirModel = mongoose.model('subdir', subdirSchema);
var directorySchema = new mongoose.Schema({_id:String, dirName:String, filesInDir:[fileSchema]});
var directoryModel = mongoose.model('directories', directorySchema);



exports.upload =  function(req, res){
  console.log("inside upload");
  var directoryId = selectedDir;
  var fileId = "";
  var cFileName =""; 
  var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("Uploading: " + filename); 
        cFileName = filename;
        fileId = directoryId+"sep897"+filename.replace(/ |#|&|\/|\*|,/g,"");
        fstream = fs.createWriteStream('./public/'+fileId);
        file.pipe(fstream);
        fstream.on('close', function () {
        	directoryModel.findById(directoryId, function(err, docs){
		    if(!err && docs){
		      var filess = new fileModel;
		      var filesd = new fileDataModel;
		      filess._id = fileId;
		      filess.fileName = cFileName;
		      filess.fileURL = "/api/GET/file/"+fileId;
		      filesd.fileEnc = encoding;
		      filesd.fileMime = mimetype;
		      filesd._id = fileId;
		      filesd.fileData = fs.readFileSync('./public/'+fileId);
		      fs.unlink('./public/'+fileId, function(er){
		        if(er) console.log("del failed");
		      });
		      docs.filesInDir.push(filess);
		      filesd.save(function(err){
		      	if(err){
		          res.end("file not pushed");
		          return;
		        }
		        else{
		        	docs.save(function(err){
		        		if(err){
		        			res.end("file meta not saved");
		          			return;
		        		}
		        		else
		        			res.redirect('back');
		      		});
		        }
		      });
		    }
		    else{
		      res.end("error finding directory");
		    }
		  });
        });
    });
    
};




exports.addFolder = function(req, res){
	var directoryName="";
	req.on('data', function(dataChunk){
		directoryName+=dataChunk;
	});
	req.on('end', function(){
		var directoryId = directoryName.replace(/ |#|&|\/|\*|,/g,"");
		directoryModel.findById(directoryId, function(err, docs){
		if(!err && docs){
			res.end("folderExists");
		}
		else{
			new directoryModel({_id:directoryId, dirName:directoryName, filesInDir:[]}).save(function(err,docs){
					if(err) res.end("error saving data");
					else{
						res.end(directoryId);
					}
				});
		}
	});

	});
}



exports.getDirs = function(req, res){
	directoryModel.find({}, '_id dirName', function(err, docs){
		if(err){
			res.end("error");
			return;
		}
		res.json(docs);
	});
};

exports.getFilesForDir = function(req,res){
	selectedDir = req.params.dirId;
	directoryModel.findOne({_id:req.params.dirId},function(err,docs){
		if(err){
			res.end("error");
			return;
		}
		
		if(docs!= null){
			res.json(docs.filesInDir);}
		else
			res.end("");
	});
};


exports.getAll = function(req, res){
	var dirs = directoryModel.find({}, function(err,docs){
		if(err){
			res.end("error");
			return;
		}
		res.json(docs);
	});
}

exports.getFile = function(req, res){
	fileDataModel.findOne({_id:req.params.fileId},
		function(err, docFiles){
			res.contentType(docFiles.fileMime);
			res.send(docFiles.fileData);
			console.log(docFiles._id);
        	});
	};

exports.deleteFile = function(req, res){
	var filId = req.params.fileId;
	var dirId = filId.split("sep897")[0];
	console.log(filId);
	
	directoryModel.findOne({_id:dirId},
		function(err, docFiles){
			if(err){
				res.send(null,500);
			} else if(docFiles){
				docFiles.filesInDir.id(filId).remove();
				docFiles.save(function(error) {
                    if (error) {
                        console.log(error);
                        res.send(null, 500);
                    } else {
                        console.log("deleted file Meta");
                    }
                });
				fs.unlink('./public/'+filId, function (err) {
  							if (err) console.log("cannot delete no File");
  							console.log('successfully deleted /tmp/hello');
				});
			}
				return;
	});

	fileDataModel.findOne({_id:req.params.fileId}, function(err, docs){
		docs.remove();
		docs.save(function(error) {
            if (error) {
                console.log(error);
                res.send(null, 500);
            } else {
                res.send("successfully deleted");
            }
        });
	});	

};
