'use strict';

module.exports = (sequelize, DataTypes) => {
    var Cultivo = sequelize.define('Cultivo', {
        cultivoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        rendimiento: {
            type: DataTypes.FLOAT(10,2)
        },
        superficieAsignada: {
            type: DataTypes.FLOAT(10,2)
        },
        precioPizarra: {
            type: DataTypes.FLOAT(15,2)
        },
        porcGastosComer: {
            type: DataTypes.FLOAT(6,2)
        },
        porcVenta: {
            type: DataTypes.FLOAT(6,2)
        },
        porcAlmacenamiento: {
            type: DataTypes.FLOAT(6,2)
        },
        porcDobleProposito: {
            type: DataTypes.FLOAT(6,2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    Cultivo.associate = function (models) {
        models.Cultivo.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.Cultivo, {
            foreignKey: 'empresaId',
        });
    };

    return Cultivo;
};