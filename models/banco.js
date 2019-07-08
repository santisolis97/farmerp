'use strict';

module.exports = (sequelize, DataTypes) => {
    var Banco = sequelize.define('Banco', {
        bancoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        montoInicial: {
            type: DataTypes.FLOAT(15, 2)
        },
        montoMovimientos: {
            type: DataTypes.FLOAT(15, 2)
        },
    }, {
        timestamps: false,
    }, );

    Banco.associate = function (models) {
        models.Banco.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Banco, {
            foreignKey: 'empresaId',
        });
    };

    return Banco;
};