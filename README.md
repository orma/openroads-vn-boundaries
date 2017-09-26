# openroads-vn-boundaries

a pipeline to take vietnam admin unit shapefiles and insert them as postgis tables into openroads-vn-api's database

### install

#### node packages
`$ yarn install`

#### s3 cli
`$ pip install awscli`

### docker
[mac](https://docs.docker.com/docker-for-mac/install/#where-to-go-next)

[pc](https://docs.docker.com/docker-for-windows/install/)

#### data

data is downloaded from an s3 bucket. There no need to add input data as it is added while the pipeline is running.

#### database

add a file `./db/local/index.js` of the following spec

```javascript
module.exports = {
  connection: {
    development: `development.db.url`,
    production:  `production.db.url`
  }
}
```

#### adding an additional processing module

to.be.added

# run

`yarn run start`
