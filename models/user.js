'use strict';
const bcrypt = require('bcrypt-nodejs');

function hashPassowrd(password) {
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(password, salt);
}

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
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                this.setDataValue('password', hashPassowrd(val));
            }
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        resetPasswordToken: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE,
        image: DataTypes.STRING,
        firstAccess: {
            type: DataTypes.BOOLEAN,
            defaultValue: true 
        },
        allowAccess: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        timestamps: true,
    }, );

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }

    User.associate = function (models) {

    };

    return User;
};