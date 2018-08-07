/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
    destDir: 'assets'
  });
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  app.import('bower_components/jspdf/dist/jspdf.min.js');
  //app.import('bower_components/highcharts/highcharts.js');
  app.import('bower_components/highcharts/highstock.js');
  //app.import('bower_components/highcharts/modules/series-label.js');
  app.import('bower_components/highcharts/modules/exporting.js');
  app.import('bower_components/highcharts/modules/export-data.js');
  //app.import('bower_components/highcharts/css/highcharts.css');
  //app.import('bower_components/highcharts/modules/data.js');
  app.import('bower_components/highcharts/modules/drilldown.js');
  app.import('bower_components/spin.js/spin.js');
  app.import('bower_components/spin.js/jquery.spin.js');
  app.import('bower_components/canvg/canvg.js');
  app.import('bower_components/rgb-color/dist/rgb-color.js');
  app.import('bower_components/jspdf-autotable/dist/jspdf.plugin.autotable.js');
  //app.import('bower_components/progressbar.js/dist/progressbar.js');
  //app.import('bower_components/progressbar.js/dist/progressbar.min.js');
  //app.import('bower_components/jquery-circle-progress/dist/circle-progress.js');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
