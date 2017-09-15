# openroads-vn-boundaries

a pipeline to take vietnam admin unit shapefiles and insert them as postgis tables into openroads-vn-api's database

### install

`$ yarn install`

### configuration

#### data

create a folder `./data/input` and add in the necessary `vietnam-communes.shp` file and its related files

#### database

add a a file `./db/local/index.js` of the following spec

```javascript
module.exports = {
  connection: {
    development: `development.db.url`,
    production:  `production.db.url`
  }
}
```

# run

`yarn run start`
