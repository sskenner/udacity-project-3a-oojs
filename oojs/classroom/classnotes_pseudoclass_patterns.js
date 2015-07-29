// *OOJS
// .Psuedoclassical Patterns
// ..Constructor Mode
// inserts lines of code when using 'new' to instantiate a new object .. thin layer of syntactical conveniece

var Car = function(loc){
  // when using 'new'
//this = Object.create(Car.prototpye); 
  var obj = Object.create(Car.prototype);
  obj.loc = loc;
  return obj;
//return this;
};

var amy = Car(1);
amy.move();
var ben = new Car(9);
ben.move();

// ..Styles of Writing classes
// class patterns have 2 distinct sections specifying:
// 1) how all the instances of a class should be similar
// 2) how each instance should be different from all the other instances.. takes place inside the constructor function

//..is true of every pseudo classical, prototypal, and functional shared class