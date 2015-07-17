var Car = function(loc) {
  var obj = Object.create(Car.methods);
  obj.loc = loc;
  return obj;
};
Car.methods = {
  move : function() {
    this.loc++;
  }
};
