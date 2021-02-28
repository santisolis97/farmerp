'use strict';

module.exports = (sequelize, DataTypes) => {
    var Movimiento = sequelize.define('Movimiento', {
        movimientoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        haciendaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipoHaciendaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoriaHaciendaOrigenId: {
            type: DataTypes.INTEGER,
        },
        entrada: {
            type: DataTypes.INTEGER,
        },
        pesoEntrada: {
            type: DataTypes.FLOAT(15, 2)
        },
        categoriaHaciendaDestinoId: {
            type: DataTypes.INTEGER,
        },
        salida: {
            type: DataTypes.INTEGER,
        },
        pesoSalida: {
            type: DataTypes.FLOAT(15, 2)
        },
        mesMovimiento: {
            type: DataTypes.INTEGER
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false,
    }, );

    Movimiento.associate = function (models) {
        models.CategoriaHacienda.belongsTo(models.Empresa, {
            foreignKey: 'empresaId', 
        });
        models.Empresa.hasMany(models.Movimiento, {
            foreignKey: 'empresaId',
        });

        models.Movimiento.belongsTo(models.Hacienda, {
            foreignKey: 'haciendaId',
        });
        models.Hacienda.hasMany(models.Movimiento, {
            foreignKey: 'haciendaId',
        });

        models.Movimiento.belongsTo(models.TipoHacienda, {
            foreignKey: 'tipoHaciendaId',
        });
        models.TipoHacienda.hasMany(models.Movimiento, {
            foreignKey: 'tipoHaciendaId',
        });
        models.Movimiento.belongsTo(models.CategoriaHacienda, {
            foreignKey: 'categoriaHaciendaOrigenId',
        });
        models.CategoriaHacienda.hasMany(models.Movimiento, {
            foreignKey: 'categoriaHaciendaOrigenId',
        });
        models.Movimiento.belongsTo(models.CategoriaHacienda, {
            foreignKey: 'categoriaHaciendaDestinoId',
        });
        models.CategoriaHacienda.hasMany(models.Movimiento, {
            foreignKey: 'categoriaHaciendaDestinoId',
        });
    };

    return Movimiento;
};