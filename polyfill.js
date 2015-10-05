if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

if (!String.prototype.iStartsWith) {
  String.prototype.iStartsWith = function(searchString, position) {
    return this.toLowerCase().startsWith(searchString.toLowerCase(), position);
  };
}
