# Project Readme

## Getting Started
To get started with this project, follow the steps below:

1. Clone repo
2. Install docker and docker compose if you have not
3. Copy `login.env.template` to `login.env` and fill with the login with your node licenses.
4. Modify `docker-compose.yml` to the appropriate number of nodes you want to run. This project has 10 to start. You'll need to make sure the name of the service and the NODE_NAME for each node you run is unique
5. Copy the correct node artifact from `bin/artifacts` and rename it to `hyper`. Replace the existing `bin/hyper` executable with the one specific to your machine OS.
5. Run `docker-compose up`

## File Structure
The file structure of this project is as follows:

- download/original_download.sh: This script is used to download and configure the Node.js binary based on the provided parameters.
- download/download.sh: This script is similar to original_download.sh, but it only prints the download URL and the node path instead of actually downloading and configuring the binary.
- Dockerfile: This file is used to build the Docker image for the project. It installs the necessary dependencies and sets the working directory.
- docker-compose.yml: This file defines the Docker services for running multiple instances of the hyper-node container.

## Additional Information
- The project uses Docker to containerize the application.
- The hyper-node service defined in docker-compose.yml can be replicated to create multiple instances of the hyper-node container.
- Each instance of the hyper-node container is associated with a unique NODE_NAME environment variable, which can be set in the login.env file.
- The hyper-node-volume1 Docker volume is used to persist data for the hyper-node container.
- The hyper-node container runs the hyper command, which is a custom command provided by the hyper binary located in the /usr/local/bin/ directory.
- The hyper command is configured using the config command before starting the container.