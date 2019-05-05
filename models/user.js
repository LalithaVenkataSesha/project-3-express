var Sequelize = require("sequelize");

var uuidv1  = require('uuid/v1');

var bcrypt  = require('bcrypt');  

module.exports = function (sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20]
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 5
      }
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.INTEGER,     
    },
    email: {
      type: DataTypes.STRING,
    }
  });

  // methods ======================
    // generating pw hash
    Users.generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    // validate pw
    Users.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };



  Users.associate = (models) => {
    Users.belongsToMany(models.Produces, {
      through: {model: models.UserProduces},
      foreignKey: 'user_id'
    });
    Users.belongsToMany(models.Inventories, {
      through: "UserInventories",
      foreignKey: 'user_id'
    });
   }
  return Users;
};