
### Docker Compose App Manager

**Cli application to enable/disable containers in docker-compose.yml & configure nginx reverse proxy**

#### Purpose

Automate container port assignment and nginx reverse proxy configuration to make it easy to host multiple apps from a single docker host.


#### Usage

##### 1) Setup an application 

- Add the configuration directly to `docker-compose.all.yml`
- Or add a basic config using `node conf.js new my-app-name`

##### 2) Enable/Disable the application

- `node conf.js en my-app-name`
- `node conf.js dis my-app-name`


#### Features
- [ ] **En**able, **Dis**able and **New** actions for updating docker-compose.yml
- [ ] Auto assign ports to prevent conflicts.
- [ ] Generate nginx reverse proxy config.

#### Future Options
- [ ] Automatically apply proxy config to nginx & run docker-compose.
- [ ] Ensure manual edits to active apps are applied to all apps.
- [ ] Support for child docker-compose.yml files instead of single containers.
- [ ] Controller / Client architecture
