'use strict';

module.exports = (sequelize, DataTypes) => {
    var DeudaComercial = sequelize.define('DeudaComercial', {
        deudaComercialId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        proveedor: {
            type: DataTypes.STRING,
        },
        monto: {
            type: DataTypes.FLOAT(15, 2)
        },
        plazo: {
            type: DataTypes.STRING,
        },
        porcEjercicio: {
            type: DataTypes.FLOAT(5, 2)
        },
        cantCuotas: {
            type: DataTypes.INTEGER,
        },
        mes1: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes2: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes3: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes4: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes5: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes6: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes7: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes8: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes9: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes10: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes11: {
            type: DataTypes.FLOAT(15, 2)
        },
        mes12: {
            type: DataTypes.FLOAT(15, 2)
        },

    }, {
        timestamps: false,
    }, );

    DeudaComercial.associate = function (models) {
        models.DeudaComercial.belongsTo(models.Empresa, {
            foreignKey: 'empresaId',
        });
        models.Empresa.hasMany(models.DeudaComercial, {
            foreignKey: 'empresaId',
        });
    };

    return DeudaComercial;
};