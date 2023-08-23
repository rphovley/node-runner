const fs = require('fs');
const { execSync } = require('child_process');

const numberOfNodes = process.env.NUM_NODES || 1;

const baseTemplate = {
  version: '3',
  services: {
    nodeuptime: {
      build: "node-uptime/.",
      env_file: ['docker.env'],
      environment: [`MIN_NUM_PODS=${numberOfNodes}`],
      volumes: ["/var/run/docker.sock:/var/run/docker.sock"]
    },
    hypernode: {
      build: '.',
      env_file:["docker.env"],
      deploy: {
        mode: 'replicated',
        replicas: numberOfNodes
      },
      restart: 'always',
      environment:[`NODE_NAME=hyper-node`],
      volumes: ["hyper-node-volume1:/root"]
    }
  },
  volumes:{
    "hyper-node-volume1": {}
  }
}



fs.writeFileSync('docker-compose.generated.yml', JSON.stringify(baseTemplate, null, 2));

try {
  console.log('Stopping any existing services...');
  execSync('docker-compose -f docker-compose.generated.yml down', { stdio: 'inherit' });

  console.log('Starting new services...');
  execSync('docker-compose -f docker-compose.generated.yml up -d', { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing docker-compose:', error);
}
