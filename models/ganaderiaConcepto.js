'use strict';

module.exports = (sequelize, DataTypes) => {
    var GanaderiaConcepto = sequelize.define('GanaderiaConcepto', {
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
        unidad: {
            type: DataTypes.STRING
        },
        porcIVA: {
            type: DataTypes.FLOAT(6,2)
        },
        mescompra:{
            type: DataTypes.INTEGER
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    GanaderiaConcepto.associate = function (models) {
        models.GanaderiaConcepto.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.GanaderiaConcepto, {
            foreignKey: 'empresaId',
        });
    };

    return GanaderiaConcepto;
};
