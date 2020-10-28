'use strict';

module.exports = (sequelize, DataTypes) => {
    var GanaderiaRubro = sequelize.define('GanaderiaRubro', {
        rubroId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    }, );

    GanaderiaRubro.associate = function (models) {
        models.GanaderiaRubro.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.GanaderiaRubro, {
            foreignKey: 'empresaId',
        });
    };

    return GanaderiaRubro;
};
