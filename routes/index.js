"use strict";

module.exports = function (app) {
    var fs = require("fs");
    var path = require("path");

    fs
        .readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function (file) {
            var fileName = file.replace(".js", "");
            var filePath = path.join(__dirname, fileName);
            var route = require(filePath);
            app.use("/" + fileName, route);
        });
}