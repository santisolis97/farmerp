'use strict';

module.exports = (sequelize, DataTypes) => {
    var Hacienda = sequelize.define('Hacienda', {
        haciendaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        tipoHaciendaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoriaHaciendaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER
        },
        kilogramoCabeza: {
            type: DataTypes.FLOAT(10, 2)
        },
        valorKilogramo: {
            type: DataTypes.FLOAT(10, 2)
        },
        tipoBien: {
            type: DataTypes.STRING
        },
        vidaUtil: {
            type: DataTypes.INTEGER
        },
        fechaCompra: {
            type: DataTypes.DATEONLY
        },
        fechaVenta: {
            type: DataTypes.DATEONLY
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    }, {
        timestamps: false,
    }, );

    Hacienda.associate = function (models) {
        models.Hacienda.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Hacienda, {
            foreignKey: 'empresaId',
        });

        models.Hacienda.belongsTo(models.CategoriaHacienda, {
            foreignKey: 'categoriaHaciendaId',
        });
        models.CategoriaHacienda.hasMany(models.Hacienda, {
            foreignKey: 'categoriaHaciendaId',
        });

        models.Hacienda.belongsTo(models.TipoHacienda, {
            foreignKey: 'tipoHaciendaId',
        });
        models.TipoHacienda.hasMany(models.Hacienda, {
            foreignKey: 'tipoHaciendaId',
        });
    };

    return Hacienda;
};