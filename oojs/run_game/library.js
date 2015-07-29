/// .Pseudoclassical Subclasses
var Car = function(loc) {
  this.loc = loc;
};
Car.prototype.move = function() {
  this.loc++;
};

var Van = function(loc) {
  Car.call(this, loc);
};
Van.prototype = Object.create(Car.prototype);
Van.prototype.constructor = Van;
Van.prototype.grab = function(){ /*..*/ };

/// Superclass & Subclass
// var Car = function() {
//   var obj = {loc: loc};
//   obj.move = function(){
//     obj.loc++;
//   };
// };

// var Van = function(loc){
//   var obj = Car(loc);
//   obj.grab = function { /*..*/ };
//   return obj;
// };

// var Cop = function(loc){
//   var obj = Car(loc);
//   obj.call = function { /*..*/ };
//   return obj;
// };

/// Pseudo classical patterns
// var Car = function(loc){
//   this.loc = loc;
// };

// Car.prototype.move = function(){
//   this.loc++;
// };

///
// var Car = function(loc){
//   var obj = Object.create(Car.prototype);
//   obj.loc = loc;
//   return obj;
// };

// Car.prototype.move = function(){
//   this.loc++;
// };



///
// var Car = function(loc){
//   var obj = Object.create(Car.methods);
//   obj.loc = loc;
//   return obj;
// };

// Car.methods = {
//   move: function(){
//     this.loc++;
//   }
// };

///
// var Car = function(loc){
//   var obj = {loc: loc};
//   extend(obj, Car.methods);
//   return obj;
// };

// Car.methods = {
//   move: function(){
//     this.loc++;
//   }
// };

/// Functional 
// var carlike = function(obj, loc){
//   obj.loc = loc;
//   obj.move = function(){
//     obj.loc++;
//   };
//   return obj;
// };

///
// // carelike -job is to augment the properties needed to be considered a car
// var carlike = function(obj, loc){
//   obj.loc = loc;
//   return obj;
// };

// var move = function(car){
//   car.loc++;
// };

///
// var move = function(car){
//   car.loc = cosine(car.loc+10)/2;
// };

///
// var move = function(car){
//   removeCarFromScreen(car.loc);
//   addDustSwirlToScreen(car.loc);
//   car.loc++;
//   addCarToScreen(car.loc);
// };