// *OOJS
// .Prototype Chains
// ..Prototype Chains
// ..Property Lookup..1-time property copying
var gold = {a:1};
console.log(gold.a); // 1
console.log(gold.z); // undefined

var blue = extend({}, gold); // pretend extend copies properties once
blue.a = 2;
console.log(blue.a); // 1
console.log(blue.b); // 2
console.log(blue.z); // undefined
// ..Predicting Prototype Delegation
// ongoing lookup-time delegation
var rose = Object.create(gold); // delegates "failed look-ups" to gold
rose.b = 2;
console.log(rose.a); // 1 .. failed lookup
console.log(rose.b); // 2 .. not a failed lookup
console.log(rose.z); // undefined

gold.z = 3;
console.log(blue.z); // undefined
console.log(rose.z); // 3

// ..The object prototype
rose.toString();
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
BEGIN refernce to MDN: Object.prototype
*/
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
BEGIN refernce to http://stackoverflow.com/questions/17893718/what-does-enumerable-mean
*/
// *whether or not a property is considered enumerable or not is based on its own [[Enumerable] attribute. you can view this as part of the property's descriptor:
var descriptor = Object.getOwnPropertyDescriptor({ bar:1 }, 'bar');

console.log(descriptor.enumerable); // true
console.log(descriptor.value); // 1

console.log(descriptor);
// Object {value: 1, writable: true, enumerable: true, configurable: true}

// A "for..in" loop then iterates through the object's property names.

var foo = { bar: 1, baz: 2};

for(var prop in foo)
  console.log(prop);
  // bar
  // baz
//..But, it only evaluates its statement-- console.log; in this case--for those properties whose [[Enumerable]] attribute is "true" .. this condition is in place bc objects actually have many more properties, especially those from inheritance:
console.log(Object.getOwnPropertyNames(Object.prototype));
// ["constructor", "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "__definGetter__", "__lookupGetter__", "__defineSetter__", "__lookupSetter__", "__proto__"]
console.log('constructor' in foo); // true
console.log('toString' in foo); // true
//..But, they're skipped(or "not counted") by the "for..in" loop bc they're non-enumerable
var descriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'constructor');
console.log(descriptor.enumerable); // false
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
END refernce to EJS-ITP
*/
// ..Constructors
function Rabbit(type) {
  this.type = type;
}

var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");
console.log(blackRabbit.type); //> black


/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
BEGIN refernce to http://stackoverflow.com/questions/17893718/what-does-enumerable-mean
*/

/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
END refernce to http://stackoverflow.com/questions/17893718/what-does-enumerable-mean
*/

/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
BEGIN refernce to EJSITP: Prototypes
*/

// .Prototypes
var empty = {};
console.log(empty.toString);
//> function toString()...{}
console.log(empty.toString());
//> [object Object]

///
console.log(Object.getPrototypeOf({}) === Object.prototype);
//> true
console.log(Object.getPrototypeOf(Object.prototype));
//> null

/*
END refernce to EJSITP: Prototypes
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/

// since JS doesn't exactly have sub-class objects, prototype is a useful workaround to make a "base class" object of certain functions that act as objects.
var Person = function() {
  this.canTalk = true;
};

Person.prototype.greet = function() {
  if (this.canTalk) {
    console.log('hi, i am' + this.name);
  }
};

var Employee = function(name, title) {
  Person.call(this);
  this.name = name;
  this.title = title;
};

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

Employee.prototype.greet = function() {
  if (this.canTalk) {
    console.log('hi, i am' + this.name + ', the ' + this.title);
  }
};

var Customer = function(name) {
  Person.call(this);
  this.name = name;
};

Customer.prototype = Object.create(Person.prototype);
Customer.prototype.constructor = Customer;

var Mime = function(name) {
  Person.call(this);
  this.name = name;
  this.canTalk = false;
};

Mime.prototype = Object.create(Person.prototype);
Mime.prototype.constructor = Mime;

var bob = new Employee('bob', 'builder');
var joe = new Customer('joe');
var rg = new Employee('red green', 'handyman');
var mike = new Customer('mike');
var mime = new Mime('mime');

bob.greet(); // hi, i am bob, the builder
joe.greet(); // hi, i am joe
rg.greet(); // hi, i am red green, the handyman
mike.greet(); // hi, i am mike
mime.greet();


/*
END refernce to MDN: Object.prototype
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/


/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
BEGIN refernce to YDKJS: Ch5 Prototypes
*/

// .[[Prototype]]


/*
END refernce to YDKLS: Ch5 Prototypes
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/