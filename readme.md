# Project Readme

## Overview

This project is a containerized application that utilizes Docker to run multiple instances of the hyper-node container. The hyper-node container runs the hyper command, which is a custom command provided by the hyper binary located in the /usr/local/bin/ directory. Also contains a script to notify you if your nodes have dropped below a certain threshold.

## Getting Started

To get started with this project, follow the steps below:

1. Install `git` and Clone repo
2. Install docker and docker-compose if you have not
3. Copy `config.json.template` to `config.json` and fill with the login from your node licenses and your sendgrid api key. You can enter as many profiles as you have. Enter the number of pods you want the uptime script to make sure are running. If the number dips below the number you put, you will receive an email at the email address provided in `config.json`
4. Install Node
5. Copy the correct node artifact from `bin/artifacts` and rename it to `hyper`. Replace the existing `bin/hyper` executable with the one specific to your machine OS.
6. Run `node run_nodes.js`

## File Structure

The file structure of this project is as follows:

- download/original_download.sh: This script is used to download and configure the Node.js binary based on the provided parameters.
- download/download.sh: This script is similar to original_download.sh, but it only prints the download URL and the node path instead of actually downloading and configuring the binary.
- Dockerfile: This file is used to build the Docker image for the project. It installs the necessary dependencies and sets the working directory.
- node-uptime: contains app that checks whether or not the required number of pods is running and sends out a message to notify you if they are not.
- run_nodes.js: 

## Additional Information

- The project uses Docker to containerize the application.
- The hyper-node service defined in docker-compose.yml can be replicated to create multiple instances of the hyper-node container.
- Each instance of the hyper-node container is associated with a unique NODE_NAME environment variable, which can be set in the login.env file.
- The hyper-node-volume1 Docker volume is used to persist data for the hyper-node container.
- The hyper-node container runs the hyper command, which is a custom command provided by the hyper binary located in the /usr/local/bin/ directory.
- The hyper command is configured using the config command before starting the container.
