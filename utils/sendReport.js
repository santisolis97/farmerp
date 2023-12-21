/* *************************************************************
    sendReport(template, datos, res [, "landscape"])
    * template: nombre del reporte 
    * datos: json con todas las variables/arrays del reporte
    * res: response recibida como parámetro
    * orientacion: opcional, "landscape" en caso de ser necesario
**************************************************************** */

module.exports = function sendReport(rptname, datos, res, orientation) {
  let ejs = require("ejs");
  let path = require("path");
  let fs = require("fs");
  let pdf = require("html-pdf");

  let d = new Date();

  let dd = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
  let MM = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);

  let hh = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
  let mm = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
  let ss = d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds();

  let _today = dd + "/" + MM + "/" + d.getFullYear();
  let _now = hh + ":" + mm + ":" + ss;

  let tempFilePath = path.resolve(
    __dirname,
    "..",
    "reports",
    "temp",
    rptname + ".pdf"
  );
  datos._pathBaseImages = path.resolve(__dirname, "..", "reports");
  datos._today = _today;
  datos._now = _now;

  ejs.renderFile(
    path.join(__dirname, "..", "reports", rptname, rptname + ".ejs"),
    datos,
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        let _height;
        let _width;
        // Tengo que ajustar las medidas porque heroku trabaja con una resolución diferente
        // 96 dpi vs 72 dpi de desarrollo
        if (process.env.NODE_ENV == "production") {
          if (orientation == "landscape") {
            _height = "278mm";
            _width = "396mm";
          } else {
            _height = "396mm";
            _width = "278mm";
          }
        } else {
          if (orientation == "landscape") {
            _height = "278mm";
            _width = "396mm";
          } else {
            _height = "396mm";
            _width = "278mm";
          }
        }
        let options = {
          //"format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
          //"orientation": (orientation) ? orientation : "portrait", // portrait - landscape
          height: _height,
          width: _width,

          border: {
            top: "0", // default is 0, units: mm, cm, in, px
            right: "0mm",
            bottom: "0in",
            left: "0in",
          },
          header: {
            height: "0",
          },
          footer: {
            height: "15mm",
            contents: {
              default: `<div style="width: 95%; margin-left:2.5%;border-top: 1px solid black; justify-content: space-between;">
                        <div style="margin-top: 10px; margin-left: 20px; position:absolute; top:0px; left:2.5%;">by FarmERP</div>
                        <div style="margin-top: 10px; margin-right: 20px; position:absolute;top:0px; right:2.5%;">Página {{page}} de {{pages}}</div>
                        </div>`,
            },
          },
        };

        pdf.create(data, options).toFile(tempFilePath, function (err, data) {
          if (err) {
            res.send(err);
          } else {
            var dataPDF = fs.readFileSync("./reports/temp/" + rptname + ".pdf");
            res.contentType("application/pdf");
            res.send(dataPDF);

            fs.unlink("./reports/temp/" + rptname + ".pdf", (err) => {
              if (err) throw err;
            });
          }
        });
      }
    }
  );
};
