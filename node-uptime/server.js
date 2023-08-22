const Docker = require('dockerode');
const sgMail = require('@sendgrid/mail');

const SENDGRID_KEY = process.env.SENDGRID_KEY
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

// Set the number of containers you want to check for
const desiredContainerCount = process.env.MIN_NUM_PODS

const ONE_HOUR = 3600000
// Create a Docker client
const docker = new Docker();

// Set your SendGrid API key
sgMail.setApiKey(SENDGRID_KEY);
let lastEmailSentTime = null;

// Function to check the number of running containers
async function checkContainerCount() {
  try {
    // Get a list of all containers
    const containers = await docker.listContainers();

    // Count the number of running containers
    const runningContainerCount = containers.filter(container => container.State === 'running').length;

    // Check if the running container count is less than the desired count
    if (runningContainerCount < desiredContainerCount) {
      // Check if an email was already sent within the last hour
      if (!lastEmailSentTime || Date.now() - lastEmailSentTime >= ONE_HOUR) {
        console.log('Some pods may be down');

        // Send an email using SendGrid
        const msg = {
          to: NOTIFY_EMAIL,
          from: 'rphovley+uptime@gmail.com',
          subject: 'Alert: Some pods may be down',
          text: 'Please check the status of your Docker containers.',
        };
        await sgMail.send(msg);

        // Update the last email sent time
        lastEmailSentTime = Date.now();
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

setTimeout(()=>{
  checkContainerCount()
  // Run the checkContainerCount function once every minute
  setInterval(checkContainerCount, 60*1000);

}, 10*1000) // wait 10 seconds for other pods to stand up