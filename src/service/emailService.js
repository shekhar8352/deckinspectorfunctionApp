const { EmailClient } = require("@azure/communication-email");

require("dotenv").config();

// This code retrieves your connection string from an environment variable.
const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
const client = new EmailClient(connectionString);

const sendEmail = async function (subject,emailId,emailBody) {
    const emailMessage = {
        senderAddress: "DoNotReply@8dfde251-7326-4eee-93b4-6e47922f74a0.azurecomm.net",
        content: {
            subject: `${subject} ${new Date().toISOString()}`,
            plainText: emailBody,
        },
        recipients: {
            to: [{ address: emailId }],
            bcc:[{address:'abhinovpankaj1@gmail.com'}]
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

module.exports = {sendEmail}

