'use strict';

module.exports = (sequelize, DataTypes) => {
    var Lote = sequelize.define('Lote', {
        loteId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        superficie: {
            type: DataTypes.INTEGER(10)
        },
        valorHectarea: {
            type: DataTypes.FLOAT(10, 2)
        },
        fechaCompra: {
            type: DataTypes.DATEONLY
        },

    }, {
        timestamps: false,
    }, );

    Lote.associate = function (models) {

    };

    return Lote;
};