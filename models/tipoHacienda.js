'use strict';

module.exports = (sequelize, DataTypes) => {
    var TipoHacienda = sequelize.define('TipoHacienda', {
        tipoHaciendaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        mortandad: {
            type: DataTypes.FLOAT(6,2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    TipoHacienda.associate = function (models) {
        models.TipoHacienda.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.TipoHacienda, {
            foreignKey: 'empresaId',
        });
    };

    return TipoHacienda;
};