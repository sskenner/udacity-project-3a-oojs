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
  var greeting = "hello, i'm " + identify.call(this);
  console.log(greeting);
}

var me = {
  name: "kyle"
};

var you = {
  name: "reader"
};

identify.call(me);
identify.call(you);

speak.call(me);
speak.call(you);

// .. instead, could explicitly pass in a context object to both
function identify(context) {
  return context.name.toUpperCase();
}

function speak(context) {
  var greeting = "hello, i'm " + identify(context);
  console.log(greeting);
}

var me = {
  name: "kyle"
};

var you = {
  name: "reader"
};

identify(you);
speak(me);

/// .Confusions
// .. inccorect meanings ..
//// .Itself
// .. attempt to track how many times a funct (foo) was called .. NO
function foo(num) {
  console.log("foo: " + num);
  // keep track of how many times 'foo' is called
  this.count++;
}

foo.count = 0;

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// how many times was 'foo' called?
console.log(foo.count); // 0 -- WTF?

// .. hack: creating another object to hold the count property
function foo(num) {
  console.log("foo: " + num);
  // keep track of how many times 'foo' is called
  data.count++;
}

var data = {
  count: 0
};

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// how many times was 'foo' called?
console.log(data.count); // 4

// generally need a reference to the function object via a lexical identifier (var) that points at it
function foo() { // 'named function'
  foo.count = 4; // 'foo' refers to itself
}

setTimeout(function() { // 'anonymous function'
  // anon function (no name), cannot refer to itself
}, 10);

// .. hack: use foo identifier as a function obj reference in ea place, and not use this at all, which works .. side-steps actual understanding of this and relies entirely on the lexical scoping of variable foo

function foo(num) {
  console.log("foo: " + num);
  // keep track of how many times 'foo' is called
  foo.count++;
}

foo.count = 0

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// how many times was 'foo' called?
console.log(foo.count); // 4

// .. hack: force this to actually point at the foo function object
function foo(num) {
  console.log("foo: " + num);
  // keep track of how many times 'foo' is called
  this.count++;
}

foo.count = 0

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo.call(foo, i);
  }
}
// how many times was 'foo' called?
console.log(foo.count); // 4

//// .Its Scope
// .. this somehow refers to the functions scope .. NO
function foo() {
  var a = 2;
  this.bar();
}

function bar() {
  console.log(this.a);
}

foo(); // ReferenceError: a is not defined

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
  console.log("baz");
  bar(); // <-- call-site for 'bar'
}

function bar() {
  // call-stack is: 'baz' -> 'bar'.. so, our call-site is in 'baz'
  console.log("bar");
  foo(); // <-- call-site for 'foo'
}

function foo() {
  // call-stack is: 'baz' -> 'bar' -> 'foo'.. so, our call-site is in 'bar'
  console.log("foo");
}

baz(); // <-- call-site for 'baz'

// ......................................

// .ch4. mixing (up) "class" objects
// .. class theory
// ... "class" design patterns
class CoolGuy {
  specialTrick = nothing

  CoolGuy(trick) {
    specialTrick = trick
  }

  showOff() {
    output("here's my trick: ", specialTrick)
  }
}
// to make a CoolGuy instance, call the class constructor
Joe = new CoolGuy("jumping rope")

Joe.showOff() // here's my trick: jumping rope

// ... Class Inheritance
class Vehicle {
  engines = 1

  ignition() {
    output("turning on my engine.");
  }

  drive() {
    ignition();
    output("steering and moving forward!")
  }
}

class Car inherits Vehicle {
  wheels = 4

  drive() {
    inherited: drive()
    output("rolling on all ", wheels, " wheels!")
  }
}

class SpeedBoat inherits Vehicle {
  engines = 2

  ignition() {
    output("turning on my ", engines, " engines.")
  }

  pilot() {
    inherited: drive()
    output("speeding through the water with ease!")
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
function mixin(sourceObj, targetObj) {
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
    console.log("turning on my engine.");
  },

  drive: function() {
    this.ignition();
    console.log("steering and moving forward!");
  }
};

var Car = mixin(Vehicle, {
  wheels: 4,

  drive: function() {
    Vehicle.drive.call(this);
    console.log(
      "rolling on all " + this.wheels + " wheels!"
    );
  }
});

// ... Mixing copies
// simplifies 'mixin()' example:
function mixin(sourceObj, targetObj) {
  for (var key in sourceObj) {
    // only copy if not present
    if (!(key in targetObj)) {
      targetObj[key] = sourceObj[key];
    }
  }

  return targetObj;
}

// > makeing copies first before specifying the Car-specific contents, then can omit the check against targetObj, but is more clunky and less efficient
// alternate mixin, less "safe" to overwrites
function mixin(sourceObj, targetObj) {
  for (var key in sourceObj) {
    targetObj[key] = sourceObj[key];
  }

  return targetObj;
}

var Vehicle = {
  // ...
};

// first, create an empty obj with Vehicle's stuff copied in
var Car = mixin(Vehicle, {});
// now copy intended contents into Car
mixin({
  wheels: 4,

  drive: function() {
    // ...
  }
}, Car);

// ... Parasitic inheritance
// "traditional js class" 'Vehicle'
function Vehicle() {
  this.engines = 1;
}
Vehicle.prototype.ignition = function() {
  console.log("turning on my engine.");
};
Vehicle.prototype.drive = function() {
  this.ignition();
  console.log("steering and moving forward!");
};

// "parasitic class" 'Car'
function Car() {
  // first, 'car' is a 'Vehicle'
  var car = new Vehicle();
  // modify 'car' to specialize it
  car.wheels = 4;
  // save a privileged reference to 'Vehicle::drive()'
  var vehDrive = car.drive;

  // override 'Vehicle::drive()'
  car.drive = function() {
    vehDrive.call(this);
    console.log(
      "rolling on all " + this.wheels + " wheels!"
    );
  }
  return car;
}
var myCar = new Car();

myCar.drive();
// turning on my engine.
// steering and moving forward!
// rolling on all 4 wheels!

// ..Implicit Mixins
var Something = {
  cool: function() {
    this.greeting = "hello world";
    this.count = this.count ? this.count + 1 : 1;
  }
};

Something.cool();
Something.greeting; // "hello world"
Something.count; // 1

var Another = {
  cool: function() {
    // implicit mixin of 'Something' to 'Another'
    Something.cool.call( this );
  }
};

Another.cool();
Another.greeting; // "hello world"
Another.count; // 1 (not shared state with 'Something')

/*
Review
Classes are a design pattern. Many languages provide syntax that enables
natural class-oriented software design. JS also has a similar
syntax, but it behaves very differently from what you’re used to with
classes in those other languages.
Classes mean copies.
When traditional classes are instantiated, a copy of behavior from class
to instance occurs. When classes are inherited, a copy of behavior from
parent to child also occurs.
Polymorphism (having different functions at multiple levels of an inheritance
chain with the same name) may seem like it implies a referential
relative link from child back to parent, but it’s still just a result
of copy behavior.
JavaScript does not automatically create copies (as classes imply) between
objects.
The mixin pattern (both explicit and implicit) is often used to sort of
emulate class copy behavior, but this usually leads to ugly and brittle
syntax like explicit pseudopolymorphism (OtherObj.method
Name.call(this, ...)), which often results in code that is harder to
understand and maintain.
Explicit mixins are also not exactly the same as class-copy behavior,
since objects (and functions!) only have shared references duplicated,
not the objects/functions themselves. Not paying attention to such
nuance is the source of a variety of gotchas.
In general, faking classes in JS often sets more landmines for future
coding than solving present real problems.
*/

// ch5 Prototypes
// .[[Prototype]]
var myObject = {
  a: 2
};

myObject.a; // 2

///
var anotherObject = {
  a:2
};
// create an object linked to 'anotherObject'
var myObject = Object.create( anotherObject );

myObject.a; // 2

///
var anotherObject = {
  a: 2
};

// create an object linked to 'anotherObject'
var myObject = Object.create( anotherObject );

for (var k in myObject) {
  console.log("found: " + k);
}
// found: a
("a" in myObject); // true

// .Object.prototype
// .Setting and Shadowing Properties
myObject.foo = "bar";
// foo property directly on myObject shadows any foo property that appears higher in the chain, bc the myObject.foo lookup would always find the foo property that's lowest in the chain

//<< chp3: Objects-getters/setters
// when defining a property to have either a getter or setter or both, its definition becomes an "accessor descriptor" (as opposed to a "data descriptor"). for accessor descriptors, the value and writable characteristics of the descriptoe are moot and ignored, and instead JS considers the set and get characteristics of the property (as well as configurable and enumerable)
var myObject = {
  // define a getter for 'a'
  get a() {
    return 2
  }
};

Object.defineProperty(
  myObject, // target
  "b",      // property name
  {         // descriptor
    // define a getter for 'b'
    get: function(){ return this.a * 2},
    
    // make sure 'b' shows up as an object property
    enumerable: true
  }
);

myObject.a; // 2
myObject.b; // 4

/// .. since only getter is defined for a, set value silently throws new assignment away bc custom getter is hardcoaded to return only 2
var myObject = {
  // define a getter for 'a'
  get a() {
    return 2
  }
};

myObject.a = 3;
myObject.a; // 2

/// .. properties should also be defined w/ setters, which override the default [[Put]] operation (aka assignment), per-property
var myObject = {
  // define a getter for 'a'
  get a() {
    return this._a_;
  },
  // define a setter for 'a'
  set a(val) {
    this._a_ = val * 2;
  }
};

myObject.a = 2;
myObject.a; // 4
//<<

// .. subtle implicit shadowing
var anotherObject = {
  a: 2
};

var myObject = Object.create( anotherObject );

console.log(anotherObject.a); // 2
console.log(myObject.a); // 2

console.log(anotherObject.hasOwnProperty( "a" )); // true
console.log(myObject.hasOwnProperty( "a" )); // false

myObject.a++; // oops, implicit shadowing!

console.log(anotherObject.a); // 2
console.log(myObject.a); // 3

console.log(myObject.hasOwnProperty( "a" )); // true

// .."Class"
// .."Class" Functions
// all functions by default get a public, nonenumerable property on them call 'prototype', which points at an otherwise arbitrary object:
function Foo() {
  // ...
}
Foo.prototype; // { }

///
function Foo() {
  // ...
}

var a = new Foo();

Object.getPrototypeOf( a ) === Foo.prototype; // true
// << ch2 new Binding
// when a function is invoked w new in front of it, otherwise known as a constructor call, the following is done automatically:
// 1. a brand new object is created (aka constructed) out of thin air
// 2. the newly constructed object is [[Prototype]]-linked
// 3. the newly constructed object is set as the this binding for that function call
// 4. unless the function returns its own alternat object, the new-incoked function call will automatically return the newly constructed object
// <<

// .."Constructors"
function Foo() {
  // ...
}
var a = new Foo();

///
function Foo() {
  // ...
}
console.log(Foo.prototype.constructor === Foo); // true

var a = new Foo();
console.log(a.constructor === Foo); // true

// ..Constructor or call?
function NothingSpecial() {
  console.log( "don't mind me!" );
}
var a = new NothingSpecial();
// "don't mind me!"
a; // {}

// ..Mechanics
function Foo(name) {
  this.name = name;
}

Foo.prototype.myName = function() {
  return this.name;
};

var a = new Foo( "a" );
var b = new Foo( "b" );

a.myName(); // "a"
b.myName(); // "b"

// .."Constructor" redux
function Foo() {/*..*/}

Foo.prototype = {/*..*/}; // create a new prototype object

var a1 = new Foo;
a1.constructor === Foo; // false!
a1.constructor === Object; // true!

//
function Foo() {/*..*/}

Foo.prototype = {/*..*/}; // create a new prototype object
// need to properly "fix" the missing '.constructor' property on the new object serving as 'Foo.prototype'. see ch3 'defineProperty(..)'
Object.defineProperty( Foo.prototype, "constructor", {
  enumerable: false,
  writable: true,
  configurable: true,
  value: Foo // point '.constructor' at 'Foo'
});

// ..(Prototypal) Inheritance
// the typical "prototype-style" code that creates such links:
function Foo(name) {
  this.name = name;
}

Foo.prototype.myName = function() {
  return this.name;
};

function Bar(name,label) {
  Foo.call( this, name );
  this.label = label;
}
// here, we make a new 'Bar.prototype' linked to 'Foo.prototype'
Bar.prototype = Object.create( Foo.prototype );
// Beware! Now 'Bar.prototype.constructor' is gone, and might need to be manually "fixed" if you're in the habit of relying on such properties!

Bar.prototype.myLabel = function() {
  return this.label;
};

var a = new Bar( "a", "obj a" );

a.myName(); // "a"
a.myLabel(); // "obj a"

// ... standardized techniques for linking Bar.prototype to Foo.prototype:
// pre-ES6 - throw away default existing 'Bar.prototype'
Bar.prototype = Object.create( Foo.prototype );
// ES6+ - modifies existing 'Bar.prototype'
Object.setPrototypeOf( Bar.prototype, Foo.prototype );

// ...Inspecting "Class" Relationships
function Foo() {
  // ...
}

Foo.prototype.blah = ...; // unexpected token err

var a = new Foo();

console.log(a instanceof Foo); // true

// ridiculouness
// helper utility to see if 'o1' is related to (delegates to) 'o2'
function isRelatedTo(o1, o2) {
  function F() {}
  F.prototype = o2;
  return o1 instanceof F;
}

var a = {};
var b = Object.create( a );
  
console.log(isRelatedTo( b, a ));  // true


// cleaner approach to [[Prototype]] reflection is:
Foo.prototype.isPrototypeOf( a );  // true

// just need two objects to inspect the relationship btw them:
// simply: does b appear anywhere in c's [[Prototype]] chain?
b.isPrototypeOf( c );
// retrieve the [[Prototype]] of an object
Object.getPrototypeOf( a ) === Foo.prototype; // true
// nonstandard alt way to access the internal [[Prototype]]
a.__proto__ === Foo.prototype; // true

// .__proto__ implementation
Object.defineProperty( Object.prototype, "__proto__", {
  get: function() {
    return Object.getPrototypeOf( this );
  },
  set: function(o) {
    // setPrototypeOf(..) as of ES6
    Object.setPrototypeOf( this, o );
    return o;
  }
});

// ...Object Links
// ..Create()ing Links
var foo = {
  something: function() {
    console.log( "tell me something good..." );
  }
};

var bar = Object.create( foo );

bar.something(); // tell me something good

// ...Object.create() polyfill
// additional functionality:
if(!Object.create)  {
  Object.create = function(o) {
    function F(){}
    F.prototype = o;
    return new F();
  };
}

///
var anotherObject = {
  a: 2
};

var myObject = Object.create( anotherObject, {
  b: {
    enumerable: false,
    writable: true,
    configurable: false,
    value: 3
  },
  c: {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 4
  }
});

myObject.hasOwnProperty( "a" ); // false
myObject.hasOwnProperty( "b" ); // true
myObject.hasOwnProperty( "c" ); // true

myObject.a; // 2
myObject.b; // 3
myObject.c; // 4

// instead of polyfilling, can use/define own custom utility:
function createAndLinkObject(o) {
  function F(){}
  F.prototype = o;
  return new F();
}

var anotherObject = {
  a: 2
};

var myObject = createAndLinkObject( anotherObject );

myObject.a; // 2

// ..Links as Fallbacks?
var anotherObject = {
  cool: function() {
    console.log( "cool!" );
  }
};

var myObject = Object.create:( anotherObject );

myObject.cool(); // "cool!"
  
///
var anotherObject = {
  cool: function() {
    console.log( "cool!" );
  }
};

var myObject = Object.create:( anotherObject );

myObject.doCool = function() {
  this.cool(); // internal delagation!
};

myObject.doCool(); // "cool!"

/*
Review
When attempting a property access on an object that doesn’t have that
property, the object’s internal [[Prototype]] linkage defines where the [[Get]] operation (see Chapter 3) should look next. This cascading
linkage from object to object essentially defines a “prototype chain”
(somewhat similar to a nested scope chain) of objects to traverse for
property resolution.
All normal objects have the built-in Object.prototype as the top of
the prototype chain (like the global scope in scope lookup), where
property resolution will stop if not found anywhere prior in the chain.
toString(), valueOf(), and several other common utilities exist on
this Object.prototype object, explaining how all objects in the language
are able to access them.
The most common way to get two objects linked to each other is using
the new keyword with a function call, which among its four steps (see
Chapter 2) creates a new object linked to another object.
The “another object” that the new object is linked to happens to be the
object referenced by the arbitrarily named .prototype property of the
function called with new. Functions called with new are often called
“constructors,” despite the fact that they are not actually instantiating
a class as constructors do in traditional class-oriented languages.
While these JavaScript mechanisms can seem to resemble “class instantiation”
and “class inheritance” from traditional class-oriented
languages, the key distinction is that in JavaScript, no copies are made.
Rather, objects end up linked to each other via an internal [[Prototype]] chain.
For a variety of reasons, not the least of which is terminology precedent,
“inheritance” (and “prototypal inheritance”) and all the other
OO terms just do not make sense when considering how JavaScript
actually works (not just applied to our forced mental models).
Instead, “delegation” is a more appropriate term, because these relationships
are not copies but delegation links.
*/

// .Ch6: Behavior Delegation
// "all about objects being linked to other objects"

// ..Toward Delegation-Oriented Design
// ...Class Theory
// loose pseudocode
class Task {
  id;
  
  // constructor 'Task()'
  Task(ID) {
    id = ID;
  }

  outputTask() {
    output( id );
  }
}

class XYZ inherits Task {
  label;
  
  // constructor 'XYZ()'
  XYZ(ID, Label) {
    super( ID );
    label = Label;
  }
  
  outputTask() {
    super();
    output( label );
  }
}

class ABC inherits Task {
  // ...
}

// ..Delegation Theory
// behavior delegation instead of classes
var Task = {
  setID:  function(ID) {
            this.id = ID;
          },
  outputID: function() {
              console.log( this.id );
            }
};

// make 'XYZ' delegate to 'Task'
var XYZ = Object.create( Task );

XYZ.prepareTask = function(ID,Label)  {
                    this.setID( ID );
                    this.label = Label;
                  };

XYZ.outputTaskDetails = function() {
                          this.outputID();
                          console.log( this.label );
                        };

// ABC = Object.create( Task );
// ABC ... = ...
// OLOO - Objects Linked to Other Objects
///
// Behavior delegation - to let some object (XYZ) provide a delegation (to Task) for property or method references if they are not found on the object (XYZ)

// ...Mututal delegation
///
// ...Mutual delegation (disallowed)
///
// ...Debugged
// "class constructor" style JS code.. Chrome Dev Tools console:
function Foo() {}

var a1 = new Foo();

a1; // Foo {} [tracks internal property] >> Object {} [firefox DTs]

///
function Foo() {}

var a1 = new Foo();

a1.constructor; // Foo(){}
a1.constructor.name; // "Foo"

///
function Foo() {}

var a1 = new Foo();

Foo.prototype.constructor = function Gotcha(){};

a1.constructor;
a1.constructor.name;

///
function Foo() {}

var a1 = Object.create( Foo );

a1; // Object {}

Object.defineProperty( Foo, "constructor", {
  enumerable: false,
  value: function Gothca() {}
});

a1; // Gotcha

// ..Mental Models Compared
// classical ("protoypal") OO style:
function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function() {
  return "i am " + this.me;
};

function Bar(who) {
  Foo.call( this, who );
}
Bar.prototype = Object.create( Foo.prototype );

Bar.prototype.speak = function() {
  alert( "hello, " + this.identify() + ".");
};

var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );

b1.speak();
b2.speak();

// ..same functionality using OLOO-style:
var Foo = {
  init: function(who) {
    this.me = who;
  },
  identify: function() {
    return "i am " + this.me;
  }
};

var Bar = Object.create( Foo );

Bar.speak = function() {
  console.log( "hello, " + this.identify() + ".");
};

var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );
b2.init( "b2" );

b1.speak();
b2.speak();

// ..Classes vs Objects
// ...Widget "Classes"
// parent class
function Widget(width,height) {
  this.width = width || 50;
  this.height = height || 50;
  this.$elem = null;
}

Widget.prototype.render = function($where) {
  if (this.$elem) {
    this.$elem.css( {
      width: this.width + "px",
      height: this.height + "px"
    }).appendTo( $where );
  }
};

// child class
function Button(width,height,label) {
  // "super" constructor call
  Widget.call( this, width, height );
  this.label = label || "default";
  
  this.$elem = $( "<button>" ).text( this.label );
}

// make "Button" "inherit" from 'Widget'
Button.prototype = Object.create( Widget.prototype );

// override base "inherited" 'render(..)'
Button.prototype.render = function($where) {
  // "super" call
  Widget.prototype.render.call( this, $where );
  this.$elem.click( this.onClick.bind( this ) );
};

Button.prototype.onClick = function(evt) {
  console.log( "Button '" + this.label + "' clicked!" );
};

$( document ).ready( function() {
  var $body = $( document.body );
  var btn1 = new Button( 125, 30, "Hello" );
  var btn2 = new Button( 150, 40, "World" );
  
  btn1.render( $body );
  btn2.render( $body );
});

// ...ES6 class sugar
class Widget {
  constructor(width,height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  }
  render($where) {
    if (this.$elem) {
      this.$elem.css( {
        width: this.width + "px",
        height: this.height + "px"
      }).appendTo( $where );
    }
  }
}

class Button extends Widget {
  constructor(width,height,label) {
    super( width, height );
    this.label = label || "default";
    this.$elem = $( "<button>" ).text( this.label );
  }
  render($where) {
    super( $where );
    this.$elem.click( this.onClick.bind( this ) );
  }
  onClick(evt) {
    console.log( "Button '" + this.label + "' clicked!" ); 
  }
}

$( document ).ready( function() {
  var $body = $( document.body );
  var btn1 = new Button( 125, 30, "Hello" );
  var btn2 = new Button( 150, 40, "World" );
  
  btn1.render( $body );
  btn2.render( $body );
});

// ..Delegating Widget Objects
var Widget = {
  init: function(width,height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  },
  insert: function($where) {
    if (this.$elem) {
      this.$elem.css( {
        width: this.width + "px",
        height: this.height + "px"
      }).appendTo( $where );
    }
  }
};

var Button = Object.create( Widget );

Button.setup = function(width,height,label) {
  // delegated call
  this.init( width, height );
  this.label = label || "default";
  
  this.$elem = $( "<button>" ).text( this.label );
};
Button.build = function($where) {
  // delegated call
  this.insert( $where );
  this.$elem.click( this.onClick.bind( this ) );
};
Button.onClick = function(evt) {
  console.log( "Button '" + this.label + "' clicked!" );
};

$( document ).ready( function() {
  var $body = $( document.body );
  
  var btn1 = Object.create( Button );
  btn1.setup( 125, 30, "Hello" );
  
  var btn2 = Object.create( Button );
  btn2.setup( 150, 40, "World" );
  
  btn1.build( $body );
  btn2.build( $body );
});

// ..Simpler Design
// examination of 2 controller objects
// Parent class
function Controller() {
  this.errors = [];
}
Controller.prototype.showDialog(title,msg) {
  // display title & message to user in dialog
};
Controller.prototype.success = function(msg) {
  this.showDialog( "Success", msg );
};
Controller.prototype.failure = function(err)  {
  this.errors.push( err );
  this.showDialog( "Error", err );
};
// Child class
function LoginController() {
  Controller.call( this );
}
// Link child class to parent
LoginController.prototype = Object.create( Controller.prototype );
LoginController.prototype.getUser = function() {
  return document.getElementById( "login_username" ).value;
};
LoginController.prototype.getUser = function() {
  return document.getElementById( "login_password" ).value;
};
LoginController.prototype.validateEntry = function(user,pw) {
  user = user || this.getUser();
  pw = pw || this.getPassword();
  
  if (!(user && pw)) {
    return this.failure(
      "please enter a username & password!"
    );
  }
  else if (user.length < 5) {
    return this.failure(
      "password must be 5+ characters!"
    );
  }
  
  // got here? validated!
  return true;
};
// override to extend base 'failure()'
LoginController.prototype.failure = function(err) {
  // "super" call
  Controller.prototype.failure.call(
    this,
    "login invalid: " + err
  );
};

// Child class
function AuthController(login) {
  Controller.call( this );
  // in addition to inheritance, we also need composition
  this.login = login;
}
// Link child class to parent
AuthController.prototype = Object.create( Controller.prototype );
AuthController.prototype.server = function(url,data) {
  return $.ajax( {
    url: url,
    data: data
  });
};
AuthController.prototype.checkAuth = function() {
  var user = this.login.getUser();
  var pw = this.login.getPassword();
  
  if (this.login.validateEntry( user, pw )) {
    this.server( "/check-auth",{
      user: user,
      pw: pw
    })
    .then( this.success.bind( this ))
    .fail( this.failure.bind( this ));
  }
};
// Override to extend base 'success()'
AuthController.prototype.success = function() {
  // "super" call
  Controller.prototype.success.call( this, "Authenticated!" );
};
// Override to extend base 'failure()'
AuthController.prototype.failure = function(err) {
  // "super" call
  Controller.prototype.failure.call(
    this,
    "Auth Failed: " + err
  );
};
var auth = new AuthController();
auth.checkAuth(
  // in addition to inheritance, we also need composition
  new LoginController()
);

// ..De-class-ified
// OLOO-style behavior
var LoginController = {
  errors: [],
  getUser: function() {
    return document.getElementById(
      "login_username"
    ).value;
  },
  validateEntry: function(user,pw) {
    user = user || this.getUser();
    pw = pw || this.getPassword();
    
    if (!(user && pw)) {
      return this.failure(
        "please enter a username & password!"
      );
    }
    else if (user.length < 5) {
      return this.failure(
        "password must be 5+ characters!"
      );
    }
    
    // got here? validated!
    return true;
  },
  showDialog: function(title,msg) {
    // display success message to user in dialog
  },
  failure: function(err) {
    this.errors.push( err );
    this.showDialog( "Error", "Login invalid: " + err );
  }
};

// Link 'AuthController' to delegate to 'LoginController'
var AuthController = Object.create( LoginController );

AuthController.errors = [];
AuthController.checkAuth = function() {
  var user = this.getUser();
  var pw = this.getPassword();
  
  if (this.validateEntry( user, pw )) {
    this.server( "/check-auth",{
      user: user,
      pw: pw
    })
    .then( this.accepted.bind( this ) )
    .fail( this.rejected.bind( this ));
  }
};
AuthController.server = function(url,data) {
  return $.ajax( {
    url: url,
    data: data
  });
};
AuthController.accepted = function() {
  this.showDialog( "Success", "Authenticated!" )
};
AuthController.rejected = function(err) {
  this.failure( "Auth Failed: " + err );
};

// no need to instantiate to perform task
AuthController.checkAuth();

// if need to create one or more additional objects in the delegation chain
var controller1 = Object.create( AuthController );
var controller2 = Object.create( AuthController );

// ..Nicer Syntax
class Foo {
  methodName() {
    /*..*/
  }
}

// using concise method declarations
var LoginController = {
  error: [],
  getUser() {
    // look ma, no 'function'!
  },
  getPassword() {
    // ..
  }
  // ..
};

// use nicer object literal syntax w/ concise methods!
var AuthController = {
  errors: [],
  checkAuth() {
    // ..
  },
  server(url,data) {
    // ..
  }
  // ..
};
// NOW, link 'AuthController' to delegate to 'LoginController'
Object.setPrototypeOf( AuthController, LoginController );

// ..Unlexical
var Foo = {
  bar() { /* .. */ },
  baz: function baz() { /* .. */ }
};
// syntax de-sugaring on how it will work
var Foo = {
  bar: function() { /* .. */ },
  baz: function baz() { /* .. */ }
};

///
var Foo = {
  bar: function(x) {
    if (x < 10) {
      return Foo.bar( x * 2 );
    }
    return x;
  },
  baz: function baz(x) {
    if (x < 10) {
      return baz( x * 2 );
    }
    return x;
  }
};

// ..Introspection
function Foo() {
  // ..
}
Foo.prototype.something = function() {
  // ..
}

var a1 = new Foo();

// later

if (a1 instanceof Foo) {
  a1.something();
}

///
function Foo()  {/* .. */ }
Foo.prototype...

function Bar()  { /* .. */ }
Bar.prototype = Object.create( Foo.prototype );

var b1 = new Bar( "b1" );
// various checks might need to perform for the above





