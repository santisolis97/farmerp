'use strict';

module.exports = (sequelize, DataTypes) => {
    var Implemento = sequelize.define('Implemento', {
        implementoId: {
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
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    Implemento.associate = function (models) {
        models.Implemento.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Implemento, {
            foreignKey: 'empresaId',
        });
    };

    return Implemento;
};