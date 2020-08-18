'use strict';

module.exports = (sequelize, DataTypes) => {
    var AgriculturaGastoDirecto = sequelize.define('AgriculturaGastoDirecto', {
        gastoDirectoId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        rubroId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cultivoId: {
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

    AgriculturaGastoDirecto.associate = function (models) {
        models.AgriculturaGastoDirecto.belongsTo(models.Cultivo, {
            foreignKey: 'cultivoId',
        });
        models.Cultivo.hasMany(models.AgriculturaGastoDirecto, {
            foreignKey: 'cultivoId',
        });

        models.AgriculturaGastoDirecto.belongsTo(models.Rubro, {
            foreignKey: 'rubroId',
        });
        models.Rubro.hasMany(models.AgriculturaGastoDirecto, {
            foreignKey: 'rubroId',
        });

        models.AgriculturaGastoDirecto.belongsTo(models.Concepto, {
            foreignKey: 'conceptoId',
        });
        models.Concepto.hasMany(models.AgriculturaGastoDirecto, {
            foreignKey: 'conceptoId',
        });

        models.AgriculturaGastoDirecto.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.AgriculturaGastoDirecto, {
            foreignKey: 'empresaId',
        });
    };

    return AgriculturaGastoDirecto;
};