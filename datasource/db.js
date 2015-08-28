var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:root@localhost:3306/brewshrew');

var Brewer = sequelize.define('Brewer', {
  name: {
    type: Sequelize.STRING,
    field: 'brewer'
  }
});

var BrewRequest = sequelize.define('BrewRequest', {
  brewName: {
    type: Sequelize.STRING,
    field: 'brew_name'
  },
  personName: {
    type: Sequelize.STRING,
    field: 'person_name'
  }
});

sequelize.sync()

module.exports.Brewer = Brewer;
module.exports.BrewRequest = BrewRequest;
module.exports.sequelize = sequelize;
