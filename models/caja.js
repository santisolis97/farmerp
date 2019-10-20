'use strict';

module.exports = (sequelize, DataTypes) => {
    var Caja = sequelize.define('Caja', {
        cajaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        montoInicial: {
            type: DataTypes.FLOAT(15, 2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    }, {
        timestamps: false,
    }, );

    Caja.associate = function (models) {
        models.Caja.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Caja, {
            foreignKey: 'empresaId',
        });
    };

    return Caja;
};