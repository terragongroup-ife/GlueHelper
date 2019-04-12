const fs = require("fs");
const rabbit = require("amqplib");
const readline = require("readline");
const axios = require("axios");
const path = require("path");

class GlueRecordHelper {
  constructor(queueURL, queueName,) {
    this.queueURL = queueURL;
    this.queueName = queueName;
  }

  consumeQueue() {
  
    rabbit.connect(this.queueURL).then(connection => {
      connection.createChannel().then(channel => {
        channel.assertQueue(this.queueName, { durable: true }).then(ok => {
          //Using the get method
          setInterval(() => {
            channel.get(this.queueName, {}).then(messageObject => {

              if (messageObject !== false) {
                
                let queueData = JSON.parse(messageObject.content.toString());
                let fullFilePath = queueData.file_path;
                
                let fileName = path.basename(fullFilePath);
                let filePath = path.dirname(fullFilePath);
                let timeStamp = Date.now();
                let outputFilePath = filePath + "/_glue_" + timeStamp + "_" + fileName;
               
                //Then perform the glue search method, write and return the queue file_path
                writeFileContents(filePath, outputFilePath);

                channel.ack(messageObject);
              }
              
            });
          }, 1000);
        });
      });
    });
  }

  writeFileContents(inputFilePath, outputFilePath) {
    const rl = readline.createInterface({
      input: fs.createReadStream(inputFilePath),
      output: fs.createWriteStream(outputFilePath)
    });

   // do some insertion here/

    rl.on("close", function() {
      //save the output file with and close
      console.log("Done");
    });
  }
}


module.exports = GlueRecordHelper;
