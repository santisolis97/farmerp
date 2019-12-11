module.exports = (sequelize, DataTypes) => {
    var Empresa = sequelize.define('Empresa', {
        empresaId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING,
        },
        inicioEjercicio: {
            type: DataTypes.DATEONLY,
        },
        finEjercicio: {
            type: DataTypes.DATEONLY,
        }

    }, {
        timestamps: false,
    }, );

    Empresa.associate = function (models) {
        
    };

    return Empresa;
};