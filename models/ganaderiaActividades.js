'use strict';

module.exports = (sequelize, DataTypes) => {
    var GanaderiaActividades = sequelize.define('GanaderiaActividades', {
        actividadesId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        cantidad: {
            type: DataTypes.FLOAT(10,2)
        },
        superficieAsignada: {
            type: DataTypes.FLOAT(10,2)
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    GanaderiaActividades.associate = function (models) {
        models.GanaderiaActividades.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.GanaderiaActividades, {
            foreignKey: 'empresaId',
        });
    };

    return GanaderiaActividades;
};