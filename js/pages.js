define(['jqmobi'], function ($) {
  // done: a function called with no arguments when the pages.html
  // file is loaded and in the DOM
  return function (done) {
    $.ajax({
      url: './pages.html',
      success: function (html) {
        $('body').append(html);
        setTimeout(done, 0);
      }
    });
  };
});
