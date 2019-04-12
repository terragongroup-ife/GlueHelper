const dotenv = require('dotenv').config();
const GlueRecordHelper = require('./app/GlueRecordHelper');


const helper = new GlueRecordHelper(
    process.env.RABBITMQ_URL, 
    process.env.QUEUE_NAME, 
)

helper.consumeQueue();
