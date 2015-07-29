// *OOJS
// .Object Decorator Pattern
// ..Code Reuse
//BEGIN run_game files >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// ..Example of Code Reuse
// ..Programming out Game
// ..Functions
// ..Benefits of refactoring code
// ..Decorator functions
//BEGIN http://www.dofactory.com/javascript/decorator-design-pattern >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*
decorator: attach additional responsibilities to an object dynamically.. provide a flexible alternatice to subclassing for extending functinality .. extends (decorates) an objects behavior dynamically .. the ability to add new behavior at runtime is accomplished by a Decorator object which 'wraps itself' around the original object. 
*/
var User = function(name) {
  this.name = name;
  
  this.say = function() {
    log.add("User: " + this.name);
  };
}

var DecoratedUser = function(user, street, city) {
  this.user = user;
  this.name = user.name; // ensures interface stays the same
  this.street = street;
  this.city = city;
  
  this.say = function() {
    log.add("Decorated User: " + this.name + ", " + this.street + ", " + this.city);
  };
}

// logging helper
var log = (function() {
  var log = "";
  
  return {
    add: function(msg) { log += msg + "/n"; }
    show: function() { alert(log); log = ""; }
  }
})();

function run() {
  
  var user = new User("Kelly");
  user.say();
  
  var decorated = new DecoratedUser(user, "Broadway", "New York");
  decorated.say();
  
  log.show();
}

//END http://www.dofactory.com/javascript/decorator-design-pattern >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//BEGIN http://www.drdobbs.com/web-development/decorator-pattern-in-javascript/232200406 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*
Decorator Pattern in JS - dynamically add functionality to JS objects at runtime
*/
var sale = new Sale(100); // the price is 100 dollars
sale = sale.decorate('fedtax'); // add federal tax
sale = sale.decorate('quebec'); // add provinvial tax
sale = sale.decorate('money'); // format like money
sale.getPrice();

// .Implementation
// starts w a constructor and a prototype method:
function Sale(price) {
  this.price = price || 100;
}
Sale.prototype.getPrice = function() {
  return this.price;
};

// decorator objects will all be implemented as properties of a constructor property:
Sale.decorators = {};

// example decorator.. an object that implements the customized 'getPrice' method .. note that the method first gets the value from the parent method and then modifies that value:
Sale.decorators.fedtax = {
  getPrice: function() {
    var price = this.uber.getPrice();
    price += price * 5 / 100;
    return price;
  }
};

//END http://www.drdobbs.com/web-development/decorator-pattern-in-javascript/232200406 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//BEGIN http://addyosmani.com/blog/decorator-pattern/ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// *Exploring the decorator patter in JS & JQuery
// ..a structural pattern that promotes code reuse and is flexible alternatice to subclassing.  this pattern is also useful for modifying existing systems where you may wish to add additional features to objects without the need to change the underlying code that uses them. 
// traditionally, the decorator is defined as a design pattern that allows behaviour to be added to an existing object dynamically. the idea is that the deoration itself isn't essential to the base functionality of an object otherwise it would be baked into the 'superclass' object itself 

// .Subclassing
//..a term that refers to inheriting properties for a new object from a base or 'superclass' object
//a base object that can have new instances of itself created
var subclassExample = subclassExample || {};
subclassExample = {
  Person: function(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = 'male'
  }
}
//a new instance of Person can then easily be created as follows:
var clark = new subclassExample.Person( "Clark" , "Kent" );
//Define a subclass constructor for for 'Superhero':
subclassExample.Superhero = function( firstName, lastName , powers ){
    /*
    Invoke the superclass constructor on the new object then use .call() to invoke the constructor as a method of the object to be initialized.
    */
    subclassExample.Person.call(this, firstName, lastName);
    //Finally, store their powers, a new array of traits not found in a normal 'Person'
    this.powers = powers;
}

subclassExample.Superhero.prototype = new subclassExample.Person;

var superman = new subclassExample.Superhero( "Clark" ,"Kent" , ['flight','heat-vision'] );

console.log(superman); /* includes superhero props as well as gender*/

// .Decorators
//..used when it's necessary to delegate responsibilities to an object where it doesn't make sense to subclass it.. i.e. that the number of features required demand for a very large quantity of subclasses
//..the decorator pattern isn't heavily tied to how objects are created but instead focuses on the problem of extending their functionality
function vehicle( vehicleType ){
    /*properties and defaults*/
    this.vehicleType = vehicleType || 'car',
    this.model = 'default',
    this.license = '00000-000'
}
/*Test instance for a basic vehicle*/
var testInstance = new vehicle('car');
console.log(testInstance);
/*vehicle: car, model:default, license: 00000-000*/
/*Lets create a new instance of vehicle, to be decorated*/
var truck = new vehicle('truck');
/*New functionality we're decorating vehicle with*/
truck.setModel = function( modelName ){
    this.model = modelName;
}
truck.setColor = function( color ){
    this.color = color;
}
/*Test the value setters and value assignment works correctly*/
truck.setModel('CAT');
truck.setColor('blue');
console.log(truck);
/*vehicle:truck, model:CAT, color: blue*/
/*Demonstrate 'vehicle' is still unaltered*/
var secondInstance = new vehicle('car');
console.log(secondInstance);
/*as before, vehicle: car, model:default, license: 00000-000*/

//..more strengths of the decorator pattern
//What we're going to decorate
function MacBook() {
    this.cost = function () { return 997; };
    this.screenSize = function () { return 13.3; };
}
/*Decorator 1*/
function Memory(macbook) {
    var v = macbook.cost();
    macbook.cost = function() {
        return v + 75;
    }
}
 /*Decorator 2*/
function Engraving( macbook ){
   var v = macbook.cost();
   macbook.cost = function(){
     return  v + 200;
  };
}
/*Decorator 3*/
function Insurance( macbook ){
   var v = macbook.cost();
   macbook.cost = function(){
     return  v + 250;
  };
}
var mb = new MacBook();
Memory(mb);
Engraving(mb);
Insurance(mb);
console.log(mb.cost()); //1522
console.log(mb.screenSize()); //13.3

//END http://addyosmani.com/blog/decorator-pattern/ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



// ..Adding Methods to Constructors
//END run_game files   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>













