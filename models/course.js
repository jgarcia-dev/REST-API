'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a course title'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A course description is required'
                },
                notEmpty: {
                    msg: 'Please provide a course description'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
        },
    }, { sequelize });

    Course.associate = (models)=> {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'UserId'
        });
    }

    return Course;
};