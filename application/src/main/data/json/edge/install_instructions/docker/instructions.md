## Install Mbk Controls Edge and connect to cloud instructions

Here is the list of commands, that can be used to quickly install and connect Mbk Controls Edge to the cloud using docker compose.

### Prerequisites

Install <a href="https://docs.docker.com/engine/install/" target="_blank"> Docker CE</a> and <a href="https://docs.docker.com/compose/install/" target="_blank"> Docker Compose</a>.

### Create data and logs folders

Run following commands, before starting docker container(s), to create folders for storing data and logs.
These commands additionally will change owner of newly created folders to docker container user.
To do this (to change user) **chown** command is used, and this command requires *sudo* permissions (command will request password for a *sudo* access):

```bash
mkdir -p ~/.mytb-edge-data && sudo chown -R 799:799 ~/.mytb-edge-data
mkdir -p ~/.mytb-edge-logs && sudo chown -R 799:799 ~/.mytb-edge-logs
{:copy-code}
```

### Running Mbk Controls Edge as docker service

${LOCALHOST_WARNING}

Create docker compose file for Mbk Controls Edge service:

```bash
nano docker-compose.yml
{:copy-code}
```

Add the following lines to the yml file:

```bash
version: '3.0'
services:
  mytbedge:
    restart: always
    image: "thingsboard/tb-edge:${TB_EDGE_VERSION}"
    ports:
      - "8080:8080"
      - "1883:1883"
      - "5683-5688:5683-5688/udp"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/tb-edge
      CLOUD_ROUTING_KEY: ${CLOUD_ROUTING_KEY}
      CLOUD_ROUTING_SECRET: ${CLOUD_ROUTING_SECRET}
      CLOUD_RPC_HOST: ${BASE_URL}
      CLOUD_RPC_PORT: ${CLOUD_RPC_PORT}
      CLOUD_RPC_SSL_ENABLED: ${CLOUD_RPC_SSL_ENABLED}
    volumes:
      - ~/.mytb-edge-data:/data
      - ~/.mytb-edge-logs:/var/log/tb-edge
  postgres:
    restart: always
    image: "postgres:12"
    ports:
      - "5432"
    environment:
      POSTGRES_DB: tb-edge
      POSTGRES_PASSWORD: postgres
    volumes:
      - ~/.mytb-edge-data/db:/var/lib/postgresql/data
{:copy-code}
```

#### [Optional] Update bind ports 
If Mbk Controls Edge is going to be running on the same machine where Mbk Controls server (cloud) is running, you'll need to update docker compose port mapping to avoid port collision between Mbk Controls server and Mbk Controls Edge.

Please update next lines of `docker-compose.yml` file:

```bash
ports:
  - "18080:8080"
  - "11883:1883"
  - "15683-15688:5683-5688/udp"
```
Make sure that ports above (18080, 11883, 15683-15688) are not used by any other application.

#### Start Mbk Controls Edge
Set the terminal in the directory which contains the `docker-compose.yml` file and execute the following commands to up this docker compose directly:

```bash
docker compose up -d
docker compose logs -f mytbedge
{:copy-code}
```

###### NOTE: Docker Compose V2 vs docker-compose (with a hyphen)

Mbk Controls supports Docker Compose V2 (Docker Desktop or Compose plugin) starting from **3.4.2** release, because **docker-compose** as standalone setup is no longer supported by Docker.
We **strongly** recommend to update to Docker Compose V2 and use it.
If you still rely on using Docker Compose as docker-compose (with a hyphen), then please execute the following commands to start Mbk Controls Edge:

```bash
docker-compose up -d
docker-compose logs -f mytbedge
```

#### Open Mbk Controls Edge UI

Once started, you will be able to open **Mbk Controls Edge UI** using the following link http://localhost:8080.

###### NOTE: Edge HTTP bind port update 

Use next **Mbk Controls Edge UI** link **http://localhost:18080** if you updated HTTP 8080 bind port to **18080**.

