'use strict';

module.exports = (sequelize, DataTypes) => {
    var parametrosAgricultura = sequelize.define('parametrosAgricultura', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        alicuota:{
            type: DataTypes.FLOAT(6,2)
        },
        iva:{
            type: DataTypes.FLOAT(6,2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    parametrosAgricultura.associate = function (models) {
        models.parametrosAgricultura.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.parametrosAgricultura, {
            foreignKey: 'empresaId',
        });
    };

    return parametrosAgricultura;
};
