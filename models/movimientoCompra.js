'use strict';

module.exports = (sequelize, DataTypes) => {
    var MovimientoCompra = sequelize.define('MovimientoCompra', {
        movimientoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        monto: {
            type: DataTypes.FLOAT(15, 2)
        },
        fecha: {
            type: DataTypes.DATEONLY
        },
        concepto: {
            type: DataTypes.STRING,
        },
        conceptoId: {
            type: DataTypes.INTEGER,
        },
        cuenta: {
            type: DataTypes.STRING,
        },
        cuentaId: {
            type: DataTypes.INTEGER,
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    }, {
        timestamps: false,
    }, );

    MovimientoCompra.associate = function (models) {
        models.MovimientoCompra.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.MovimientoCompra, {
            foreignKey: 'empresaId',
        });
    };

    return MovimientoCompra;
};