"use strict";
var express = require('express');
var router = express.Router();
require("dotenv").config();
const WebSocket = require('ws');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const hubName = 'reportnotificationhub';
const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hubName);

router.route('/negotiate')
  .get(async function (req, res) {
    let token = await serviceClient.getClientAccessToken({roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"] });
    res.status(200).send( token.url );
  });
router.route('/pushmessage')
  .post(async function (req, res) {
    const notificationMessageText = req.query.message;       
    await broadcastMessageToHub(notificationMessageText);
    res.status(200).send('message sent');
  });

async function broadcastMessageToHub(projectName){
    
    // Send a JSON message
    await serviceClient.sendToAll({ message: `Report for project: ${projectName} is ready, please visit reports sections to download.` });
}
module.exports = router;
