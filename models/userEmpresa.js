'use strict';

module.exports = (sequelize, DataTypes) => {
    var UserEmpresa = sequelize.define('UserEmpresa', {
        userId: {
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        empresaId: {
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        anioCursado : DataTypes.INTEGER

    }, {
        timestamps: false,
    }, );

    UserEmpresa.associate = function (models) {
        models.UserEmpresa.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.UserEmpresa, {
            foreignKey: 'empresaId',
        });

        models.UserEmpresa.belongsTo(models.User, {
            foreignKey: 'userId',
        });
        models.User.hasMany(models.UserEmpresa, {
            foreignKey: 'userId',
        });
    };

    return UserEmpresa;
};