'use strict';

module.exports = (sequelize, DataTypes) => {
    var Stock = sequelize.define('Stock', {
        stockId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        producto: {
            type: DataTypes.STRING,
        },
        detalle: {
            type: DataTypes.STRING,
        },
        unidad: {
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

    Stock.associate = function (models) {
        models.Stock.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Stock, {
            foreignKey: 'empresaId',
        });
    };

    return Stock;
};