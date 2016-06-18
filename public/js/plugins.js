$(document).ready(function ($) {
  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  $.fn.reverse = [].reverse; // Smallest jquery plugin on earth
});
