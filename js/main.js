/* string and various helper functions */
String.prototype.startsWith = function (str) {
    "use strict";
    return this.indexOf(str) === 0;
};

require([
  'app',
  'pages',
  'license',
  'help',
  'animation',
  'sound',
  'pirates',
  'rockets',
  'bowling',
  'domReady!'
], function (App, pagesLoader, license_init, help_init) {
  pagesLoader(function () {
    App();
    license_init("license", "home_page");
    help_init("home_help", "help_");
  });
});
