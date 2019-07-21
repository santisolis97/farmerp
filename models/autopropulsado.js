'use strict';

module.exports = (sequelize, DataTypes) => {
    var Autopropulsado = sequelize.define('Autopropulsado', {
        autopropulsadoId: {
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
        uta: {
            type: DataTypes.FLOAT(10, 2)
        },
        anchoTrabajo: {
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

    Autopropulsado.associate = function (models) {
        models.Autopropulsado.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Autopropulsado, {
            foreignKey: 'empresaId',
        });
    };

    return Autopropulsado;
};