'use strict';

module.exports = (sequelize, DataTypes) => {
    var GanaderiaGastoDirecto = sequelize.define('GanaderiaGastoDirecto', {
        gastoDirectoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        rubroId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        actividadesId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        conceptoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantRequerida: {
            type: DataTypes.FLOAT(15, 2)
        },
        cantAplicaciones: {
            type: DataTypes.INTEGER,
        },
        mes1: {
            type: DataTypes.BOOLEAN
        },
        mes2: {
            type: DataTypes.BOOLEAN
        },
        mes3: {
            type: DataTypes.BOOLEAN
        },
        mes4: {
            type: DataTypes.BOOLEAN
        },
        mes5: {
            type: DataTypes.BOOLEAN
        },
        mes6: {
            type: DataTypes.BOOLEAN
        },
        mes7: {
            type: DataTypes.BOOLEAN
        },
        mes8: {
            type: DataTypes.BOOLEAN
        },
        mes9: {
            type: DataTypes.BOOLEAN
        },
        mes10: {
            type: DataTypes.BOOLEAN
        },
        mes11: {
            type: DataTypes.BOOLEAN
        },
        mes12: {
            type: DataTypes.BOOLEAN
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    GanaderiaGastoDirecto.associate = function (models) {
        models.GanaderiaGastoDirecto.belongsTo(models.GanaderiaActividades, {
            foreignKey: 'actividadesId',
        });
        models.GanaderiaActividades.hasMany(models.GanaderiaGastoDirecto, {
            foreignKey: 'actividadesId',
        });

        models.GanaderiaGastoDirecto.belongsTo(models.GanaderiaRubro, {
            foreignKey: 'rubroId',
        });
        models.GanaderiaRubro.hasMany(models.GanaderiaGastoDirecto, {
            foreignKey: 'rubroId',
        });

        models.GanaderiaGastoDirecto.belongsTo(models.GanaderiaConcepto, {
            foreignKey: 'conceptoId',
        });
        models.GanaderiaConcepto.hasMany(models.GanaderiaGastoDirecto, {
            foreignKey: 'conceptoId',
        });

        models.GanaderiaGastoDirecto.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.GanaderiaGastoDirecto, {
            foreignKey: 'empresaId',
        });
    };

    return GanaderiaGastoDirecto;
};