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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false,
    }, );

    Empresa.associate = function (models) {
        models.Empresa.belongsTo(models.User, {
            foreignKey: 'userId',
        });
        models.User.hasMany(models.Empresa, {
            foreignKey: 'userId',
        });
    };

    return Empresa;
};