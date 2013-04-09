/* string and various helper functions */
String.prototype.startsWith = function (str) {
    "use strict";
    return this.indexOf(str) === 0;
};

require([
  'app',
  'license',
  'help',
  'animation',
  'sound',
  'pirates',
  'rockets',
  'bowling',
  'domReady!'
], function (App) {
  App();
});
