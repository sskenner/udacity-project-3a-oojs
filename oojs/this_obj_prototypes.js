//////////
// continued in >> Kyle Simpson. “You Don't Know JS: this & Object Prototypes.” iBooks.
//////////

// .CH 1: this of That?
/*
Review
this binding is a constant source of confusion for the JavaScript developer
who does not take the time to learn how the mechanism actually
works. Guesses, trial and error, and blind copy and paste from
Stack Overflow answers is not an effective or proper way to leverage
this important this mechanism.
To learn this, you first have to learn what this is not, despite any
assumptions or misconceptions that may lead you down those paths.
this is neither a reference to the function itself, nor is it a reference
to the function’s lexical scope.
this is actually a binding that is made when a function is invoked, and
what it references is determined entirely by the call-site where the
function is called.
*/
function identify() {
  return this.name.toUpperCase();
}

function speak() {
  var greeting = "hello, i'm " + identify.call( this );
  console.log( greeting );
}

var me = {
  name: "kyle"
};

var you = {
  name: "reader"
};

identify.call( me );
identify.call( you );

speak.call( me );
speak.call( you );

// .. instead, could explicitly pass in a context object to both
function identify(context) {
  return context.name.toUpperCase();
}

function speak(context) {
  var greeting = "hello, i'm " + identify( context );
  console.log( greeting );
}

var me = {
  name: "kyle"
};

var you = {
  name: "reader"
};

identify( you );
speak( me );

/// .Confusions
// .. inccorect meanings ..
//// .Itself
// .. attempt to track how many times a funct (foo) was called .. NO
function foo(num) {
  console.log( "foo: " + num );
  // keep track of how many times 'foo' is called
  this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
  if (i>5) {
    foo( i );
  }
}
// how many times was 'foo' called?
console.log( foo.count ); // 0 -- WTF?

// .. hack: creating another object to hold the count property
function foo(num) {
  console.log( "foo: " + num );
  // keep track of how many times 'foo' is called
  data.count++;
}

var data = {
  count: 0
};

var i;

for (i=0; i<10; i++) {
  if (i>5) {
    foo( i );
  }
}
// how many times was 'foo' called?
console.log( data.count ); // 4

// generally need a reference to the function object via a lexical identifier (var) that points at it
function foo() {  // 'named function'
  foo.count = 4;  // 'foo' refers to itself
}

setTimeout( function() {  // 'anonymous function'
  // anon function (no name), cannot refer to itself
}, 10);

// .. hack: use foo identifier as a function obj reference in ea place, and not use this at all, which works .. side-steps actual understanding of this and relies entirely on the lexical scoping of variable foo

function foo(num) {
  console.log( "foo: " + num );
  // keep track of how many times 'foo' is called
  foo.count++;
}

foo.count = 0

var i;

for (i=0; i<10; i++) {
  if (i>5) {
    foo( i );
  }
}
// how many times was 'foo' called?
console.log( foo.count ); // 4

// .. hack: force this to actually point at the foo function object
function foo(num) {
  console.log( "foo: " + num );
  // keep track of how many times 'foo' is called
  this.count++;
}

foo.count = 0

var i;

for (i=0; i<10; i++) {
  if (i>5) {
    foo.call( foo, i );
  }
}
// how many times was 'foo' called?
console.log( foo.count ); // 4

//// .Its Scope
// .. this somehow refers to the functions scope .. NO
function foo() {
  var a = 2;
  this.bar();
}

function bar() {
  console.log( this.a );
}

foo();  // ReferenceError: a is not defined

//// .What's this?
/*
this is:
  - a runtime binding
  - contextual based on the conditions of the function's invocation
  - has everything to do with the manner in which the function is called
*/

// .CH 2: this All Makes Sense Now!
/*
Review
Determining the this binding for an executing function requires
finding the direct call-site of that function. Once examined, four rules
can be applied to the call-site, in this order of precedence:
1. Called with new? Use the newly constructed object.
2. Called with call or apply (or bind)? Use the specified object.
3. Called with a context object owning the call? Use that context
object.
4. Default: undefined in strict mode, global object otherwise.

Be careful of accidental/unintentional invoking of the default binding
rule. In cases where you want to “safely” ignore a this binding, a
“DMZ” object like ø = Object.create(null) is a good placeholder
value that protects the global object from unintended side effects.

Instead of the four standard binding rules, ES6 arrow-functions use
lexical scoping for this binding, which means they inherit the this
binding (whatever it is) from its enclosing function call. They are essentially
a syntactic replacement of self = this in pre-ES6 coding.
*/

// this is a binding made for each function invocation, based entirely on its call-site (how the function is called)

/// .Call-Site
function baz() {
  // call-stack is: 'baz'.. so, our call-site is in the global scope
  console.log( "baz" );
  bar();  // <-- call-site for 'bar'
}

function bar() {
  // call-stack is: 'baz' -> 'bar'.. so, our call-site is in 'baz'
  console.log( "bar" );
  foo(); // <-- call-site for 'foo'
}

function foo() {
  // call-stack is: 'baz' -> 'bar' -> 'foo'.. so, our call-site is in 'bar'
  console.log( "foo" );
}

baz(); // <-- call-site for 'baz'

// ......................................

// .ch4. mixing (up) "class" objects
// .. class theory
// ... "class" design patterns
class CoolGuy {
  specialTrick = nothing

  CoolGuy( trick ) {
    specialTrick = trick
  }

  showOff() {
    output( "here's my trick: ", specialTrick )
  }
}
// to make a CoolGuy instance, call the class constructor
Joe = new CoolGuy( "jumping rope" )

Joe.showOff() // here's my trick: jumping rope

// ... Class Inheritance
class Vehicle {
  engines = 1

  ignition() {
    output( "turning on my engine." );
  }

  drive() {
    ignition();
    output( "steering and moving forward!")
  }
}

class Car inherits Vehicle {
  wheels = 4

  drive() {
    inherited:drive()
    output( "rolling on all ", wheels, " wheels!")
  }
}

class SpeedBoat inherits Vehicle {
  engines = 2

  ignition() {
    output( "turning on my ", engines, " engines." )
  }

  pilot() {
    inherited:drive()
    output( "speeding through the water with ease!" )
  }
}

// ... Polymorphism
// > the idea that any method can (relatively) reference (look one level up) another method at a higher level of the inheritence hierarchy
// > class inheritance implies copies

// ... Multiple Inheritance
// > see the diamond problem

// .. Mixins
// > no "classes" in JS to instantiate, only objects.. objects dont get copied to other objects, they get linked together.. in JS: faking the missing copy behavior of classes = mixins

// ... Explicit Mixins
// > extend(..) = mixin(..)
// simplified 'mixin(..)' example:
function mixin( sourceObj, targetObj ) {
  for (var key in sourceObj) {
    // only copy if not already present
    if (!(key in targetObj)) {
      targetObj[key] = sourceObj[key];
    }
  }
  return targetObj;
}
var Vehicle = {
  engines: 1,

  ignition: function() {
    console.log( "turning on my engine." );
  },

  drive: function() {
    this.ignition();
    console.log( "steering and moving forward!" );
  }
};

var Car = mixin( Vehicle, {
  wheels: 4,

  drive: function() {
    Vehicle.drive.call( this );
    console.log(
      "rolling on all " + this.wheels + " wheels!"
    );
  }
});

// ... Mixing copies
// simplifies 'mixin()' example:
function mixin( sourceObj, targetObj ) {
  for (var key in sourceObj) {
    // only copy if not present
    if (!(key in targetObj)) {
      targetObj[key] =sourceObj[key];
    }
  }

  return targetObj;
}

// > makeing copies first before specifying the Car-specific contents, then can omit the check against targetObj, but is more clunky and less efficient
// alternate mixin, less "safe" to overwrites
function mixin( sourceObj, targetObj ) {
  for (var key in sourceObj) {
    targetObj[key] = sourceObj[key];
  }

  return targetObj;
}

var Vehicle = {
  // ...
};

// first, create an empty obj with Vehicle's stuff copied in
var Car = mixin( Vehicle, {} );
// now copy intended contents into Car
mixin( {
  wheels: 4,

  drive: function() {
    // ...
  }
}, Car );

// ... Parasitic inheritance
// "traditional js class" 'Vehicle'
function Vehicle() {
  this.engines = 1;
}
Vehicle.prototype.ignition = function() {
  console.log( "turning on my engine." );
};
Vehicle.prototype.drive = function() {
  this.ignition();
  console.log( "steering and moving forward!" );
};

// "parasitic class" 'Car'
function Car() {

}












