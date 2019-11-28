'use strict';

module.exports = (sequelize, DataTypes) => {
    var Insumo = sequelize.define('Insumo', {
        insumoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        concepto: {
            type: DataTypes.STRING,
        },
        cantidad: {
            type: DataTypes.INTEGER(10)
        },
        valorUnitario: {
            type: DataTypes.FLOAT(10, 2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    Insumo.associate = function (models) {
        models.Insumo.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Insumo, {
            foreignKey: 'empresaId',
        });
    };

    return Insumo;
};