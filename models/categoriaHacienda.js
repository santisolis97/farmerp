'use strict';

module.exports = (sequelize, DataTypes) => {
    var CategoriaHacienda = sequelize.define('CategoriaHacienda', {
        categoriaHaciendaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        }

    }, {
        timestamps: false,
    }, );

    CategoriaHacienda.associate = function (models) {
        models.CategoriaHacienda.belongsTo(models.TipoHacienda, {
            foreignKey: 'tipoHaciendaId',
        });
        models.TipoHacienda.hasMany(models.CategoriaHacienda, {
            foreignKey: 'empresaId',
        });
    };

    return CategoriaHacienda;
};