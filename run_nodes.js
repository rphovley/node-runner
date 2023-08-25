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
let previous = ''

for(let i=0; i<profiles.length; i++){
  const profile = profiles[i]
  baseTemplate.services[`uptime_${profile.serviceName}`] = {
    build: 'node-uptime/.',
    environment: [
      `MIN_NUM_PODS=${profile.nodeCount}`, 
      `NOTIFY_EMAIL=${profile.notifyEmail}`,
      `SENDGRID_KEY=${sendgridKey}`
    ],
    volumes: ['/var/run/docker.sock:/var/run/docker.sock']
  }

  for(let j=0; j<profile.nodeCount; j++){
    const nodeName = `hyper-node_${profile.serviceName}_${j}`
    let current = {
      build: '.',
      restart: 'always',
      environment:[
        `NODE_NAME=${nodeName}`,
        `NODE_EMAIL=${profile.nodeEmail}`,
        `NODE_PASSWORD=${profile.nodePassword}`,
        `NODE_LOG_LEVEL=${profile.logLevel}`
      ],
      volumes: [`hyper-node-volume1:/root/node_${nodeName}`]
    }
    if(previous){
      current.depends_on = [previous]
    }
    baseTemplate.services[`hypernode_${profile.serviceName}_${j}`] = current
    previous = `hypernode_${profile.serviceName}_${j}`
    
  }
}

// console.log(JSON.stringify(baseTemplate, null, 2))
fs.writeFileSync('docker-compose.generated.yml', JSON.stringify(baseTemplate, null, 2))

try {
  console.log('Stopping any existing services...')
  execSync('docker-compose -f docker-compose.generated.yml down', { stdio: 'inherit' })

  console.log('Starting new services...')
  execSync('docker-compose -f docker-compose.generated.yml up -d', { stdio: 'inherit' })
} catch (error) {
  console.error('Error executing docker-compose:', error)
}