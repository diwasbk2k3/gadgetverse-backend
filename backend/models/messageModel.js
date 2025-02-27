const { DataTypes } = require('sequelize');
const sequelize = require('../database/db'); // Adjust the path based on your structure

const Message = sequelize.define('Message', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'messages',
  timestamps: false,  // You can adjust this to false if you don't need timestamps
});

module.exports = Message;