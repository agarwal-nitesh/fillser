fillser
=======

# Node.js File Upload
----Created By Nitesh Agarwal on 15/10/14. All rights reserved.
	Copyright (c) 2014 Nitesh. 
	niteshagarwal1.618@gmail.com

## This application is a file browser application.
## It can be used to add directories and put files under those directories.
## It has REST services to upload and retrieve files from mobile Applications.
## It also has HTML5 frontend to create directories and upload files.
## It stores uploaded files to mongoDB in binary format
## While retrieving it returns file with proper format (mime type).
## Files

The Node.js starter application has files as below:

*   routes/
	
	*	_post.js

	This file contains all nodejs REST services for create, upload, retreive files.
	

*   app.js

	This file contains the server side JavaScript code for the application written using the Node.js API

*   views/

	This directory contains the views of the application. It is required by the express framework and jade template engine in this sample application.

*   public/

	This directory contains public resources of the application. It is required by the express framework in this sample application.

*   package.json

	This file is required by the Node.js environment. It specifies this Node.js project name, dependencies, and other configurations of your Node.js application.



