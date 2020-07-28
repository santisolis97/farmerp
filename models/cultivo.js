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