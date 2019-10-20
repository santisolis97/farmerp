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
        cantidad: {
            type: DataTypes.INTEGER
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
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
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