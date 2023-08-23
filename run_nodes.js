const fs = require('fs')
const {profiles, sendgridKey} = require('./config.json')
const { execSync } = require('child_process')


const baseTemplate = {
  version: '3',
  services: {

  },
  volumes:{
    'hyper-node-volume1': {}
  }
}

for(let i=0; i<profiles.length; i++){
  const profile = profiles[i]
  baseTemplate.services[`uptime_${profile.serviceName}`] = {
    build: 'node-uptime/.',
    env_file: ['docker.env'],
    environment: [
      `MIN_NUM_PODS=${profile.nodeCount}`, 
      `NOTIFY_EMAIL=${profile.notifyEmail}`,
      `SENDGRID_KEY=${sendgridKey}`
    ],
    volumes: ['/var/run/docker.sock:/var/run/docker.sock']
  }

  baseTemplate.services[`hypernode_${profile.serviceName}`] = {
    build: '.',
    env_file:['docker.env'],
    deploy: {
      mode: 'replicated',
      replicas: `${profile.nodeCount}`
    },
    restart: 'always',
    environment:[
      `NODE_NAME=hyper-node_${profile.serviceName}`,
      `NODE_EMAIL=${profile.nodeEmail}`,
      `NODE_PASSWORD=${profile.nodePassword}`
    ],
    volumes: ['hyper-node-volume1:/root']
  }
}


fs.writeFileSync('docker-compose.generated.yml', JSON.stringify(baseTemplate, null, 2))

try {
  console.log('Stopping any existing services...')
  execSync('docker-compose -f docker-compose.generated.yml down', { stdio: 'inherit' })

  console.log('Starting new services...')
  execSync('docker-compose -f docker-compose.generated.yml up', { stdio: 'inherit' })
} catch (error) {
  console.error('Error executing docker-compose:', error)
}
