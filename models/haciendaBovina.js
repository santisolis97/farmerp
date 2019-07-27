'use strict';

module.exports = (sequelize, DataTypes) => {
    var HaciendaBovina = sequelize.define('HaciendaBovina', {
        haciendaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        categoria: {
            type: DataTypes.STRING,
        },
        kilogramoCabeza: {
            type: DataTypes.FLOAT(10, 2)
        },
        valorKilogramo: {
            type: DataTypes.FLOAT(10, 2)
        },
        tipoBien: {
            type: DataTypes.STRING
        },
        vidaUtil: {
            type: DataTypes.INTEGER
        },
        fechaCompra: {
            type: DataTypes.DATEONLY
        },
        fechaVenta: {
            type: DataTypes.DATEONLY
        }
    }, {
        timestamps: false,
    }, );

    HaciendaBovina.associate = function (models) {
        models.HaciendaBovina.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.HaciendaBovina, {
            foreignKey: 'empresaId',
        });
    };

    return HaciendaBovina;
};