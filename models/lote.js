'use strict';

module.exports = (sequelize, DataTypes) => {
    var Lote = sequelize.define('Lote', {
        loteId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        superficie: {
            type: DataTypes.INTEGER(10)
        },
        valorHectarea: {
            type: DataTypes.FLOAT(10, 2)
        },
        fechaCompra: {
            type: DataTypes.DATEONLY
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

    Lote.associate = function (models) {
        models.Lote.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Lote, {
            foreignKey: 'empresaId',
        });
    };

    return Lote;
};