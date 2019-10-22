'use strict';

module.exports = (sequelize, DataTypes) => {
    var Pradera = sequelize.define('Pradera', {
        praderaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        cultivo: {
            type: DataTypes.STRING,
        },
        fechaImplantacion: {
            type: DataTypes.DATEONLY
        },
        hectareas: {
            type: DataTypes.INTEGER(10)
        },
        valorHectarea: {
            type: DataTypes.FLOAT(10, 2)
        },
        vidaUtil: {
            type: DataTypes.INTEGER(10)
        },
        valorResidual: {
            type: DataTypes.FLOAT(5, 2)
        },
        estado: {
            type: DataTypes.STRING,
        },
        empresaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    Pradera.associate = function (models) {
        models.Pradera.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.Pradera, {
            foreignKey: 'empresaId',
        });
    };

    return Pradera;
};