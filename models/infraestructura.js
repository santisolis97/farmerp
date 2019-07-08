'use strict';

module.exports = (sequelize, DataTypes) => {
    var Infraestructura = sequelize.define('Infraestructura', {
        infraestructuraId: {
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
        cantidad: {
            type: DataTypes.INTEGER(10)
        },
        unidad: {
            type: DataTypes.STRING,
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
        valorVenta: {
            type: DataTypes.FLOAT(15, 2)
        },
        cuentaVenta: {
            type: DataTypes.STRING,
        },

    }, {
        timestamps: false,
    }, );

    Infraestructura.associate = function (models) {
        models.Infraestructura.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Infraestructura, {
            foreignKey: 'empresaId',
        });
    };

    return Infraestructura;
};