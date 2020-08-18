'use strict';

module.exports = (sequelize, DataTypes) => {
    var Concepto = sequelize.define('Concepto', {
        conceptoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        precio: {
            type: DataTypes.FLOAT(15,2)
        },
        porcIVA: {
            type: DataTypes.FLOAT(6,2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    Concepto.associate = function (models) {
        models.Concepto.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.Concepto, {
            foreignKey: 'empresaId',
        });
    };

    return Concepto;
};
