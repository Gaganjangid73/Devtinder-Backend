const { SESClient } = require("@aws-sdk/client-ses");

let sesClient = null;

if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
  // Set the AWS Region.
  const REGION = "ap-south-1";
  // Create SES service object.
  sesClient = new SESClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });
}

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]