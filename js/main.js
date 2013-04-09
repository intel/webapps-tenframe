/* string and various helper functions */
String.prototype.startsWith = function (str) {
    "use strict";
    return this.indexOf(str) === 0;
};

require([
  'pages',
  'domReady!'
], function (pagesLoader) {
  pagesLoader(function () {
    require([
        'app',
        'license',
        'help',
        'animation',
        'sound',
        'pirates',
        'rockets',
        'bowling'
    ], function (App, license_init, help_init) {
        App();
        license_init("license", "home_page");
        help_init("home_help", "help_");
    });
  });
});
