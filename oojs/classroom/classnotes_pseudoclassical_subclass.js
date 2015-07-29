// *OOJS
// .Pseudoclassical Subclasses
// ..Building out a Subclass
// ..'this' in Superclass using new
var Car = function(loc) {
//this = Object.create(Car.prototype);
  this.loc = loc;
};
Car.prototype.move = function() {
  this.loc++;
};

var Van = function(loc) {
//this = Object.create(Van.prototype);  
  new Car(loc);
};

// ..'this' in Superclass without using new
// .. .call()'s First Argument
// .. using .call()
var product = function(a, b) {
  return a * b;
};

var double = function(x) {
  return product(x, 2);
};

double(3);

//..is same as
var product = function(b) {
  return this * b;
};

var double = function() {
  return product.call(this, 2);
};

double.call(3);

// ..Subclass Property Prototype Delegation

// ..Subclass Method Prototype Delegation

// ..Constructor prototype delegation

// ..Subclass Prototype Delegation
Van.prototype = Object.create(Car.prototype);

// ..Incorrect Subclass Prototype Delegation

Van.prototype = new Car()
// NO NO NO NO NO.. bc has adverse side affects

// ..Using Object.create()

// ..Subclass Prototype Constructor Property

// ..Subclass Constructor Delegation

// ..Proper Subclass Constructor Delegation























