'use strict';

module.exports = (sequelize, DataTypes) => {
    var Equipo = sequelize.define('Equipo', {
        equipoId: {
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
        uta: {
            type: DataTypes.FLOAT(10, 2)
        },
        utaAcarreo: {
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
        }

    }, {
        timestamps: false,
    }, );

    Equipo.associate = function (models) {
        models.Equipo.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Equipo, {
            foreignKey: 'empresaId',
        });
    };

    return Equipo;
};