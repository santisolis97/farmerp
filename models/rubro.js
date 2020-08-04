'use strict';

module.exports = (sequelize, DataTypes) => {
    var Rubro = sequelize.define('Rubro', {
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

    Rubro.associate = function (models) {
        models.Rubro.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.Cultivo, {
            foreignKey: 'empresaId',
        });
    };

    return Rubro;
};
