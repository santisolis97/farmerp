'use strict';

module.exports = (sequelize, DataTypes) => {
    var Tractor = sequelize.define('Tractor', {
        tractorId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        concepto: {
            type: DataTypes.STRING,
        },
        fechaCompra: {
            type: DataTypes.DATEONLY
        },
        potencia: {
            type: DataTypes.FLOAT(10, 2)
        },
        valorUnitario: {
            type: DataTypes.FLOAT(10, 2)
        },
        vidaUtil: {
            type: DataTypes.INTEGER(10)
        },
        valorResidual: {
            type: DataTypes.FLOAT(5, 2)
        },
        estado: {
            type: DataTypes.STRING,
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

    Tractor.associate = function (models) {
        models.Tractor.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Tractor, {
            foreignKey: 'empresaId',
        });
    };

    return Tractor;
};