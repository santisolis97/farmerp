'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Empresas", deps: []
 * createTable "Infraestructuras", deps: []
 * createTable "Lotes", deps: []
 * createTable "Users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2019-07-06T23:42:45.691Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Empresas",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Infraestructuras",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Lotes",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {

            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
