// 7. prototypal classes
// . delegation relationships
/////////
// https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/ch1.md
// ch1: what is scope
// A. compiler theory
  // 1. tokenizing, 2. parsing, 3. code generation
// B. understanding scope
  // B1. the cast
    // Engine: start-to-finish compilation & execution of JS program
    // Compiler: one of Engine's friends; handles parsing and code gen
    // Scope: another Engine friend; collects & maintains look-up list of all declared identifiers (vars), and enforces strict set of rules as to how they are accessible to currently exectuing code
  // B2. back & forth
    // two distinct actions are taken for a var assignment: first, Compiler declares a var (if not previously declared in current scope), & second, when executing, Engine looks up the var in Scope & assigns to it, if found.
  // B3. compiler speak
    // Engine pe ???
//> An RHS look-up is indistinguishable, for our purposes, from simply a look-up of the value of some variable, whereas the LHS look-up is trying to find the variable container itself, so that it can assign... i.e.  "who's the target of the assignment (LHS)" and "who's the source of the assignment (RHS)".
//////////
// continued in >> Kyle Simpson. “You Don't Know JS: Scope & Closures.” iBooks.
//////////
//"who's the target of the assignment (LHS)?" .. lookup "variable" .. assigned to ..
// vs
//"who's the source of the assignment (RHS)?" .. lookup "value" .. retrieve value of ..

/// Engine/Scope Convo
function foo(a) {
  console.log( a ); // 2 // 3) RHS look-up for the value of "a"
  // 4) console.log(..) needs a ref to execute .. RHS look-up for console object, then property resolution to see if it has a method called log .. 5) LHS/RHS exchange of passing "2" (RHS) into log(..), which has params, first of which (maybe arg1) has an LHS ref look-up, b4 assigning "2" to it
}

foo( 2 ); // 1) RHS reference to foo .. "go lookup the value of foo and give it to me"
// 2) implied "a = 2" .. when "2" is passed as arg to foo(..) function i.e. is assigned to the param "a"
/*
Engine: Hey Scope, I have an RHS reference for foo. Ever heard of it?
Scope: Why yes, I have. Compiler declared it just a second ago. It’s a function. Here you go.
Engine: Great, thanks! OK, I’m executing foo.
Engine: Hey, Scope, I’ve got an LHS reference for a, ever heard of it?
Scope: Why yes, I have. Compiler declared it as a formal parameter to foo just recently. Here you go.
Engine: Helpful as always, Scope. Thanks again. Now, time to assign 2 to a.
Engine: Hey, Scope, sorry to bother you again. I need an RHS look-up for console. Ever heard of it?
Scope: No problem, Engine, this is what I do all day. Yes, I’ve got console. It’s built-in. Here ya go.
Engine: Perfect. Looking up log(..). OK, great, it’s a function.
Engine: Yo, Scope. Can you help me out with an RHS reference to a. I think I remember it, but just want to double-check.
Scope: You’re right, Engine. Same variable, hasn’t changed. Here ya go.
Engine: Cool. Passing the value of a, which is 2, into log(..).
*/

// ch 1 quiz
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo( 2 );

// ..1. identify all the LHS look-ups: c =.., a = 2 (implicit param assigment) & b = ..
// ..2. identify all the RHS look-ups: foo(2.., = a;, a + .., & .. + b
///

// Nested Scope
function foo(a) {
  console.log( a + b );
}

var b = 2;
foo( 2 );
/*
Engine: “Hey, Scope of foo, ever heard of b? Got an RHS reference for it.”
Scope: “Nope, never heard of it. Go fish.”
Engine: “Hey, Scope outside of foo, oh you’re the global scope, OK cool. Ever heard of b? Got an RHS reference for it.”
Scope: “Yep, sure have. Here ya go.”
*/

/// Building on Metaphors
/*Review
Scope is the set of rules that determines where and how a variable (identifier) can be looked up. This look-up may be for the purposes of assigning to the variable, which is an LHS (lefthand-side) reference, or it may be for the purposes of retrieving its value, which is an RHS (righthand-side) reference.
LHS references result from assignment operations. Scope-related assignments can occur either with the = operator or by passing arguments to (assign to) function parameters.
The JavaScript engine first compiles code before it executes, and in so doing, it splits up statements like var a = 2; into two separate steps:
First, var a to declare it in that scope. This is performed at the beginning, before code execution.
Later, a = 2 to look up the variable (LHS reference) and assign to it if found.
Both LHS and RHS reference look-ups start at the currently executing scope, and if need be (that is, they don’t find what they’re looking for there), they work their way up the nested scope, one scope (floor) at a time, looking for the identifier, until they get to the global (top floor) and stop, and either find it[…]
*/

// Ch 2. Lexical Scope
/*
“Review
Lexical scope means that scope is defined by author-time decisions of where functions are declared. The lexing phase of compilation is essentially able to know where and how all identifiers are declared, and thus predict how they will be looked up during execution.
Two mechanisms in JavaScript can “cheat” lexical scope: eval(..) and with. The former can modify existing lexical scope (at runtime) by evaluating a string of “code” that has one or more declarations in it. The latter essentially creates a whole new lexical scope (again, at runtime) by treating an object reference as a scope and that object’s properties as scoped identifiers.
The downside to these mechanisms is that it defeats the engine’s ability to perform compile-time optimizations regarding scope look-up, because the engine has to assume pessimistically that such optimizations will be invalid. Code will run slower as a result of using either feature. Don’t use them.”
*/

/// Lex-time
function foo(a) {
  var b = a * 2;

  function bar(c) {
    console.log( a, b, c );
  }

  bar( b * 3 );
}

foo( 2 ); // 2, 4, 12

//// Look-ups
// “No matter where a function is invoked from, or even how it is invoked, its lexical scope is only defined by where the function was declared.”

/// Cheating Lexical
// “cheating lexical scope leads to poorer performance.”
/*
“eval

The eval(..) function in JavaScript takes a string as an argument and treats the contents of the string as if it had actually been authored code at that point in the program.”
*/
function foo(str, a) {
  eval( str ); //cheating!!
  console.log( a, b );
}

var b = 2;

foo( "var b = 3;", 1 ); // 1, 3
/*
“The string "var b = 3;" is treated, at the point of the eval(..) call, as code that was there all along. Because that code happens to declare a new variable b, it modifies the existing lexical scope of foo(..). In fact, as mentioned earlier, this code actually creates variable b inside of foo(..) that shadows the b that was declared in the outer (global) scope.
When the console.log(..) call occurs, it finds both a and b in the scope of foo(..), and never finds the outer b. Thus, we print out “1, 3” instead of “1, 2” as would have normally been the case.”
*/
///
/*
“with

The other frowned-upon (and now deprecated!) feature in JavaScript that cheats lexical scope is the with keyword.”
*/
// “with is typically explained as a shorthand for making multiple property references against an object without repeating the object reference itself each time.”
var obj = {
  a: 1,
  b: 2,
  c: 3
};
// more "tedious" to repeat "obj"
obj.a = 2;
obj.b = 3;
obj.C = 4;
// "easier" shorthand
with (obj) {
  a = 3;
  b = 4;
  c = 5;
}

// consider
function foo(obj) {
  with (obj) {
    a = 2;
  }
}

var o1 = {
  a: 3
};
var o2 = {
  b: 3
};

foo( o1 );
console.log( o1.a ); // 2

foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2-Oops, leaked global
/*
“we note a peculiar side-effect, the fact that a global variable a was created by the a = 2 assignment. How can this be?
The with statement takes an object, one that has zero or more properties, and treats that object as if it is a wholly separate lexical scope, and thus the object’s properties are treated as lexically defined identifiers in that scope.”
*/

// Ch 3. Function Versus Block Scope
// “Review
// Functions are the most common unit of scope in JavaScript. Variables and functions that are declared inside another function are essentially “hidden” from any of the enclosing scopes, which is an intentional design principle of good software.
// But functions are by no means the only unit of scope. Block scope refers to the idea that variables and functions can belong to an arbitrary block (generally, any { .. } pair) of code, rather than only to the enclosing function.
// Starting with ES3, the try/catch structure has block scope in the catch clause.
// In ES6, the let keyword (a cousin to the var keyword) is introduced to allow declarations of variables in any arbitrary block of code. if (..) { let a = 2; } will declare a variable a that essentially hijacks the scope of the if’s { .. } block and attaches itself there.
// Though some seem to believe so, block scope should not be taken as an outright replacement of var function scope. Both functionalities co-exist, and developers can and should use both function-scope and block-scope techniques where respectively appropriate to produce better, more readable/maintainable code.”

/// Scope from Functions
// let's explore function scope and it's implications
function foo(a) {
  var b = 2;
  // some code

  function bar() {
    // ...
  }
  // more code
  var c = 3;

}

bar(); // fails
console.log( a, b, c ); // all 3 fail

/// Hiding in Plain Scope
// possibly "dangerous"
function doSomething(a) {
  b = a + doSomethingElse( a * 2 );

  console.log( b * 3 );
}

function doSomethingElse(a) {
   return a - 1;
}

var b;

doSomething( 2 ); // 15

// more "proper"
function doSomething(a) {
  function doSomethingElse(a) {
    return a - 1;
  }

  var b;

  b = a + doSomethingElse( a * 2 );

  console.log( b * 3 );
}

doSomething( 2 ); // 15

//// Collision Avoidence
function foo() {

  function bar(a) {
    var i = 3; // w/o "var"(declaring var locally) changing 'i' in enclosing scope's for loop
    console.log( a + i );
  }

  for (var i=0; i<10; i++) {
    bar( i * 2 ); // Oops, infinite loop ahead
  }
}

foo();

//// Global namespaces
var MyReallyCoolLibrary = {
  awesome: "stuff",
  doSomething: function() {
    // ...
  },
  doAnotherThing: function() {
    // ...
  }
};

///// Module management
// see Ch5

/// Functions as Scope
// as function declaration
var a = 2;

function foo() {
  var a = 3;
  console.log( a ); // 3
} // <-- and this
foo(); // <-- and this

console.log( a );

// as function expression
var a = 2;

(function foo() { // insert this
  var a = 3;
  console.log( a ); // 3
})(); // and this

console.log( a ); // 2

// function expressions as callback parameters
setTimeout( function() {
  console.log("i waited 1 second!");
}, 1000 );

// inline function expressions
setTimeout( function timeoutHandler() { // has a name
  console.log("i waited 1 second!");
}, 1000 );

// IIFE - immediately invoked function expression
var a = 2;

(function IIFE() {
  var a = 3;
  console.log( a ); // 3
})();

console.log( a ); // 2

// IIFE variation1: invoke () pair moved inside the outer ()
var a = 2;

(function IIFE() {
  var a = 3;
  console.log( a ); // 3
}()); // invoking () moved inside outer ()

console.log( a ); // 2

// IIFE variation2: are just function calls, & pass in args
var a = 2;

(function IIFE( global ) {
  var a = 3;
  console.log( a ); // 3
  console.log( global.a );  // 2
})( window );

console.log( a ); // 2

// IIFE variation3: name param undefined, and don't pass and values for arg
undefined = true; // landmine set for other code! avoid

(function IIFE( undefined ) {
  var a;
  if (a === undefined) {
      console.log( "undefined is safe here" ); // 3
  }
})();

// IIFE variation4: function to execute given 2nd, after invocation & params to pass to it .. UMD (Universal Module Definition) project
var a = 2;

(function IIFE( def ) {
  def( window );
})(function def( global ) {
  var a = 3;
  console.log( a ); // 3
  console.log( global.a );  // 2
});

/// .Blocks as Scopes

// common JS idiom
for (var i=0; i<10; i++) {
  console.log( i );
}

// declare vars as close as possible, as local as possible, to where they will be used
var foo = true;

if (foo) {
  var bar = foo * 2;  // fake block scoping
  bar = something( bar );
  console.log( bar );
}

// try/catch: specify the var declaration in the catch clause of a try/catch to be blocke-scoped to the catch block
try {
  undefined();  // illegal operation to force an exception
}
catch (err) {
  console.log( err ); // works!
}
console.log( err ); // ReferenceError: 'err' not found

// let implicitly hijacks any block's scope for its var declaration
var foo = true;

if(foo) {
  let bar = foo * 2;
  bar = something( bar );
  console.log( bar );
}

console.log( bar ); // ReferenceError

// ..better ..
var foo = true;

if (foo) {
  { // <-- explicit block
    let bar = foo * 2;
    bar = something( bar );
    console.log( bar );
  }
}
console.log( bar ); // ReferenceError

// let will not hoist to the entire scope of the block they appear
{
  console.log( bar ); // ReferenceError!
  let bar = 2;
}

// garbage collection
function process(data) {
  // ...
}

var someReallyBigData = {...};

process( someReallyBigData );

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt) {
  console.log("button clicked");
}, /*capturingPhase=*/false );

///
function process(data) {
  // ...
}
// anything declared inside this block can go away after!
{
  var someReallyBigData = {...};

  process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt) {
  console.log("button clicked");
}, /*capturingPhase=*/false );

/// let loops
for (let i=0; i<10; i++) {
  console.log( i );
}

console.log( i ); // Reference error

/// another way to illustrate the per-iteration binding behavior
{
  let j;
  for (j=0; j<10; j++) {
  let i = j;  // re-bound for each iteration!
  console.log( i );
  }
}

// but there can be gotchas when refactoring
var foo = true, baz = 10;

if (foo) {
  var bar = 3;

  if (baz > bar) {
    console.log( baz );
  }
  // ...
}

// ..refactored as ..
var foo = true, baz = 10;

if (foo) {
  var bar = 3;

  // ...
}

if (baz > bar) {
  console.log( baz );
}

// ...
var foo = true, baz = 10;

if (foo) {
  let bar = 3;
  if (baz > bar) {
    console.log( baz ); // <-- dont forget 'bar' when moving!
  }
}

// const
var foo = true;

if (foo) {
  var a = 2;
  const b = 3;  // blocked-scoped to the containing 'if'

  a = 3;
  b = 4;  // error!
}

console.log( a );
console.log( b ); // ReferenceError!

/// .Hoisting
/*
“Review
We can be tempted to look at var a = 2; as one statement, but the JavaScript engine does not see it that way. It sees var a and a = 2 as two separate statements, the first one a compiler-phase task, and the second one an execution-phase task.
What this leads to is that all declarations in a scope, regardless of where they appear, are processed first before the code itself is executed. You can visualize this as declarations (variables and functions) being “moved” to the top of their respective scopes, which we call hoisting.
Declarations themselves are hoisted, but assignments, even assignments of function expressions, are not hoisted.
Be careful about duplicate declarations, especially mixed between normal var declarations and function declarations—peril awaits if you do!”
*/

/// first snippet
a = 2;  // var a;
  // the first part is the compilation..
var a;  // a = 2;
  // the second part is the execution
console.log( a );

/// second snippet
console.log( a ); // var a = 2;
  // see above
var a = 2;  // console.log( a );

a = 2;
/// if hoisting were to rearrange the logic .. no, no

foo();

function foo() {
  console.log( a ); // undefined

  var a = 2;
}
// is actually..
function foo() {
  console.log( a ); // undefined

  var a = 2;
}
foo();

//// The Compiler Strikes Again
/// first snippet cont..
var a;  // compilation
a = 2;  // execution
console.log( a );

/// second snippet cont..
var a;
console.log( a );
a = 2;

///
foo();

function foo() {
  console.log( a ); // undefined
  var a = 2;
}
/// ..can be more accrately interpreted as ..
function foo() {
  var a;
  console.log( a ); // undefined
  a = 2;
}
foo();

// .. function declarations are hoisted but function expressions are not
foo(); // not ReferenceError, but TypeError!
var foo = function bar() {
  // ..
};

// name identifier not available in the closing scope
foo();  // TypeError
bar();  // ReferenceError

var foo = function bar() {
  // ..
}
/// ..can be more accrately interpreted as ..
var foo;

foo();  // TypeError
bar();  // ReferneceError

foo = function() {
  var bar = ..self..
  // ...
}

//// Functions First
foo();  // 1
var foo;


function foo() {
  console.log( 1 );
}

foo = function() {
  console.log( 2 );
};

/// ..can be more accrately interpreted (by Engine) as ..
function foo() {
  console.log( 1 );
}

foo();  // 1

foo = function() {
  console.log( 2 );
};

/// .. subsequent function declarations do iveride previous ones
foo();  // 3

function foo() {
  console.log( 1 );
}

var foo = function() {
  console.log( 2 );
};

function foo() {
  console.log( 3 );
}

/// function declarations inside normal blocks typically hoist to the enclosing scope
foo();  // "b"

var a = true;
if (a) {
  function foo() { console.log("a"); }
} else {
  function foo() { console.log("b"); }
}

/// .Scope Closure
/*
Review
Closure seems to the unenlightened like a mystical world set apart
inside of JavaScript that only the few bravest souls can reach. But it’s
actually just a standard and almost obvious fact of how we write code
in a lexically scoped environment, where functions are values and can
be passed around at will.
Closure is when a function can remember and access its lexical scope
even when it’s invoked outside its lexical scope.
Closures can trip us up, for instance with loops, if we’re not careful to
recognize them and how they work. But they are also an immensely
powerful tool, enabling patterns like modules in their various forms.

Modules require two key characteristics: 1) an outer wrapping function
being invoked, to create the enclosing scope 2) the return value
of the wrapping function must include reference to at least one inner
function that then has closure over the private inner scope of the
wrapper.
Now we can see closures all around our existing code, and we have the
ability to recognize and leverage them to our own benefit!
*/

///
function foo() {
  var a = 2;

  function bar() {  // RHS reference look-up for "a"
    console.log( a ); // 2
  }

  bar();
}
foo();

// closure in full light
function foo() {
  var a = 2;
  function bar() {  // bar() has lexical scope access to inner scope of foo()
    console.log( a );
  }
  return bar; // passed as a value.. return function object itself that bar references
}
var baz = foo();

baz();  // 2 -- closure observed

// example of observing/exercising closure
function foo() {
  var a = 2;

  function baz() {
    console.log( a ); // 2
  }

  bar( baz );
}
var fn = foo();

function bar(fn) {
  fn(); // look ma, closure!
}

//.. example of indirect passings-around of functions
var fn;

function foo() {
  var a = 2;

  function baz() {
    console.log( a );
  }

  fn = baz; // assign baz to global var
}

function bar() {
  fn(); // look ma, closure!
}

foo();
bar();

//// .Now I Can See
// academic and artificially constructed to illustrate using closure
function wait(message) {
  setTimeout( function timer() {
    console.log( message );
  }, 1000 );
}

wait( "Hello, closure!" );

//.. or if using jQuery or any other JS framework
function setupBot(name, selector) {
  $( selector ).click( function activator() {
    console.log( "Activating: " + name );
  } );
}

setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );

// <<>> .. passing in random callback function
var a = 2;

(function IIFE() {
  console.log( a );
})();

//// .Loops and Closure
// most common canonical ex used to illustrate closure
for (var i=1; i<=5; i++) {
  setTimeout( function timer() {
    console.log( i );
  }, i*1000 );
} // .. doesnt count up.. why?

// .. let's try:
for (var i=1; i<=5; i++) {
  (function() {
    setTimeout( function timer() {
      console.log( i );
    }, i*1000 );
  })();
} // still nope

// .. it needs its own var, w a copy of i var at ea iteration
for (var i=1; i<=5; i++) {
  (function() {
    var j = i;
    setTimeout( function timer() {
      console.log( j );
    }, j*1000 );
  })();
}

// .. variation that some prefer
for (var i=1; i<=5; i++) {
  (function(j) {
    setTimeout( function timer() {
      console.log( j );
    }, j*1000 );
  })(i);
}

//// .Block Scoping Revisited
// the let declar, hijacks a block and declares a var right in the block, essentially turns a block into a scope that we can close over
for (var i=1; i<=5; i++) {
  let j = i;  // yay, block-scope for closure!
  setTimeout( function timer() {
    console.log( j );
  }, j*1000 );
}

//.. let declar used in the head of the for loop


///////// end

// > library.js /////////////////////
var Car = function(loc) {  // 'Car' is a var pointing to a f() that will create 'cars'
  //var obj = {loc: loc};  // 'Car' creates a new JS 'obj', then assigns 'loc' argument to the 'loc' property of 'obj' .. easier to understand if dont have same name
  var obj = { loc: locArg };
  extend(obj, Car.methods);  // 'extend' although unexplained is supposed to take all properties from object1 (or second) 'obj' and create them as props for the target (or first) 'obj', whereas "jQuery.extend(taget[, object1][, objectN])" => merge contents of two or more objects together in the first object .. i.e. 'obj.move' will exist now w/ every property in 'Car.methods'
  return obj;
};
Car.methods = {  // adding the properties of 'methods' to 'obj', not to 'Car'
  move : function() {
    this.loc++;
  }
};

// > run.js /////////////////////
var amy = Car(1);
amy.move();
var ben = Car(9);
ben.move();

//* NOTE ******************************
// parameters vs arguments -  a param is the var which is part of the method's signature (method declaration), an argument is an expression used when calling the method OR when a method is called, the args are the data passed into the methods params
void Foo(int i, float f)  // 'i' & 'f' are params
{
  // do things
}
void Bar()
{
  int anInt = 1;
  Foo(anInt, 2.0);  // 'anInt' & '2.0' are args
}
//OR /////////////////////
public void MyMethod(string mParam) {...}
//...
string myArg1 = "this is my argument";
myClass.MyMethod(myArg1)

// Define a method with two parameters
int Sum(int num1, int num2)
{
   return num1 + num2;
}

// Call the method using two arguments
var ret = Sum(2, 3);
//
//*************************************
