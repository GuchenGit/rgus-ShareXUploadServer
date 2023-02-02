# rgus Custom ShareX Upload Server
## Introduction
A simple server created to handle ShareX file upload and deletion. The package runs on javascript (nodejs) for request handling.
## Features
+ File upload, deletion and view
+ Automatic unique URL generation for each upload
+ Password based authentication for file upload
+ Hashed codes for file deletion (so only the creator can remove their own files)
+ Automatic file removal after specific time
## Requirements and Installation
### Prerequisites
+ Node.js (version 14.14 or higher) along with npm (server)
+ ShareX (client)
### Installation
1. Download and extract the files to the target location.
2. Install all packages via npm.
3. Create a .env file in the root directory with the following lines: 
     + PORT = [your_port] 
     + PASSWORD = [your_password]
4. Run app.js.
5. Setup your ShareX configuration.

### Setting up ShareX
You may need too use the latest version of ShareX!
#### Importing the configuration file
The easiest way to configure ShareX is by using the .sxcu file located in the ShareX folder. <br>
Simply go to Destinations -> Custom uploader and import the settings. Make sure to adjust domains, ports and parameters accordingly. <br>
**Important!** ShareX adds "\\" to the links. You need to remove them in order for them to work.

#### Creating a custom configuration on your own
1. Create a new preset under Destinations -> Custom uploader settings.
2. Select Post method using the following request URL: http://[your_domain]:[your_port]/send
3. In the body choose Form data and enter: 
     + The parameter "password" with the value of your chosen password.
     + The parameter "livingTime" with the time span the file should exist on the server (in milliseconds). **This is client sided.**
4. As the File form name use "name".
5. Use the following two URLs:
     + URL: http://[your_domain]:[your_port]/view/{json:path}
     + Deletion URL: http://[your_domain]:[your_port]/delete/{json:deletePath}/{json:deleteKey}

**Important!** Only insert your own values where [] are present.
