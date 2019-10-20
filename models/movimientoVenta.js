'use strict';

module.exports = (sequelize, DataTypes) => {
    var MovimientoVenta = sequelize.define('MovimientoVenta', {
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

    MovimientoVenta.associate = function (models) {
        models.MovimientoVenta.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.MovimientoVenta, {
            foreignKey: 'empresaId',
        });
    };

    return MovimientoVenta;
};