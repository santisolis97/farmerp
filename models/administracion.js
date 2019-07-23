'use strict';

module.exports = (sequelize, DataTypes) => {
    var Administracion = sequelize.define('Administracion', {
        administracionId: {
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
        }

    }, {
        timestamps: false,
    }, );

    Administracion.associate = function (models) {
        models.Administracion.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Administracion, {
            foreignKey: 'empresaId',
        });
    };

    return Administracion;
};