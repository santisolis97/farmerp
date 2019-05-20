'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        userId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        apellido: {
            type: DataTypes.STRING,
        },
        mail: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }

    }, {
        timestamps: false,
    }, );

    User.associate = function (models) {

    };

    return User;
};