// *OOJS
// .Scopes
// ..Lexical Scope

// >>> [begin reference]
// .YDKJS/Scope
// ..What is Scope?
// ...Compiler Theory
// compilation = 3 steps b4 execution
// 1) Tokenizing/Lexing: breaking up string of characters into meaningful (to the language) chunks called tokens..
var a = 2; // broken up into: var, a, =, 2 and ;
// 2) Parsing: taking stream (array) of tokens and turning it into a tree of elements ('AST': abstract syntax tree) .. tope-level node: VariableDeclaration ('var') >> child node: Identifier ('a') >> another child: AssignmentExpression ('=') >> has child called NumericLiteral ('2')
// 3) Code-Generation: process of taking an AST and turning it into executable code .. handwaving .. take AST for 'var a = 2;' and turn it into a set of machine instructions to actually create a variable called 'a' (including reserving memory, etc), and then store a value into 'a'.

// ..Understanding Scope
// think of process in terms of conversation
// ...The Cast
// -Engine: responsible for start-to-finish compilation and execution of JS prgm
// -Compiler: handles dirty work of parsing and code-generation
// -Scope: collects and maintains a look-up list of all declared identifiers(variables), and enforces a strict set of rules as to how these are accessible to currently executing code

// ..Back and Forth
// Compiler: 1) perform lexing (break it down into tokens) >> 2) parse into Abstract Syntax Tree

      //////////// [begin sublime] ////////////
      
// ..Back and Forth
/*
>> Compiler <<
i) perform lexing (break it down into tokens)
ii) parse into Abstract Syntax Tree
1) encountering 'var a'
1a) asks Scope to see if var 'a' already exists for that particular scope collection
  - if so: ignores this declaration and moves on
  - if not: asks Scope to declare a new var called 'a' for that scope collection
2) next produces code for Engine to later execute, to handle the 'a = 2' assignment
>> Engine <<
  - runs code that will first ask Scope if there is a variable called 'a' accessible in the current scope collection
  - if so: uses that var
  - if not: looks elsewhere
    - if eventually finds a var: it assigns the value '2'
    - if not: will raise hand and yell out 'Error!'

Summary: 2 distinct actions are taken for a var assignment:
1) Compiler declares a var (if not prviously declared) in the current Scope
2) when executing, Engine looks up the var in Scope and assigns to it, if found
*/

// ..Compiler Speak
// types of look-ups of an assignment operation:
/*
LHS (left hand side)- "who is the target of the assignment?" - when var appears on the lefthand side of an assignment operation.. 

  **"trying to find the variable container itself so that it can assign"**

RHS (right hand side)- more accurately means "not lefthand side"

  **"who is the source of the assignment?" - "retreive his/her source (value)".. "go get the value of.."**..

*/

      //////////// [end sublime] ////////////  

console.log( a );
// reference to 'a' is RHS bc we're looking up to retrieve the value of 'a', so that the value can be passed to console.log( .. ) .. bc nothing is being assigned to here

a = 2;
// LHS reference bc we want to find the variable container itself as a target for the '= 2' assignment operation.. we dont care what the current value is 

////
function foo(a) {
  console.log( a ); // 2 & (3) & (4)
}

foo( 2 ); // (1) & (2)

// (1) RHS - "go look up the value of foo, and give it to me" & (..) means the value of foo should be executed (ie a function)
// (2) LHS - implicitly assign to the parameter 'a'
// (3) RHS - look-up for the "console" object, then a property resolution occurs to see if it has a method called 'log'
// (4) RHS/LHS - variable 'a''s RHS look-up and can assume inside log(..) has some parameters (say "arg1") has an LHS reference look-up, b4 assigning 2 to it

      ////////// [begin "hoisting in js" reference] //////////
// http://john-dugan.com/hoisting-in-javascript/
// hoisting in js
var foo = "bar";

function bar() {
  var foo = "baz";
  
  function baz(foo) {
    foo = "bam";
    bam = "yay";
  }
  baz();
}

bar();
foo;  // "bar"
bam;  // "yay"
baz();  // Error!

// Compilation phase
// first step is taken by the JS "engine"
// line 1: hey global "scope", i have a declaration for a var named foo
// line 3: hey global "scope", i have a declaration for a function named bar
// line 4: hey bar "scope", i have a declaration for a var named foo
// line 6: hey bar "scope", i have a declaration for a function named baz
// line 6: hey baz "scope", i have a declaration for a parameter named foo

// Execution phase
// second step is taken by the JS "engine"
/*
LHS = var container itself (target)
RHS = go lookup the value of x, & give it to me (source)

line 1: hey global "scope", i have an LHS ref for a var named foo.. ever heard of it? 
  >> yes, the global scope has.. bc foo was declared on line 1 of the compilation phase, so assignment occurs

line 13: hey global "scope", i have a RHS reference for a var named bar.. ever heard of it?
  >> yes, the global scope has.. bc bar was declared as function on line 3 of the compilation phase, so the function executes

line 4: hey bar "scope", i have a LHS reference for a var named foo.. ever heard of it?
  >> yes, the bar scope has.. bc foo was declared on line 4 of the compilation phase, so assignment occurs

line 10: hey bar "scope", i have a RHS reference for a var named baz.. ever heard of it?
  >> yes, the bar scope has.. bc baz was declared as function on line 6 of the compilation phase, so the function executes

line 7: hey baz "scope", i have a LHS reference for a var named foo.. ever heard of it?
  >> yes, the baz scope has.. bc foo was declared as a parameter of the baz function on line 6 of the compilation phase, so assignment occurs

line 8: hey baz "scope", i have a LHS reference for a var named bam.. ever heard of it?
  >> NOPE, the baz scope HAS NOT.. therefore we look for bam in the next outer scope (bar)

  ::::: hey bar "scope", i have a LHS reference for a var named bam.. ever heard of it?
  >> NOPE, the bar scope HAS NOT.. therefore we look for bam in the next outer scope (global)

  ::::: hey global "scope", i have a LHS reference for a var named bam.. ever heard of it?
  >> NOPE, the global scope HAS NOT.. therefore global scope automatically declares a var named bam (if NOT in strict mode o.w. a ref error: bam not defined.. will be thrown)

line 14: hey global "scope", i have a RHS reference for a var named foo.. ever heard of it?
  >> yes, the global scope has.. bc foo was declared and assigned the value of string bar on line 1 of the compilation phase 

line 15: hey global "scope", i have a RHS reference for a var named bam.. ever heard of it?
  >> yes, the global scope has.. bc bam was (NOT in strict mode) declared and assigned value of string yay on line 9 of the execution phase

line 16: hey global "scope", i have a RHS reference for a var named baz.. ever heard of it?
  >> NO, the global scope has NOT.. bc baz exists in the function scope of bar.. therefore it is inaccessible to global scope and a reference error: baz is not defined is thrown
*/

/*
// js hoisting .. compilation + execution

** code as authored by developer **
a;
b;
var a = b;
var b = 2;
b;
a;

>> before compilation <<
** Notice: Variable declarations have been hoisted to the top of the containing scope (global) **
var a;
var b;
a;
b;
a = b;
b = 2;
b;
a;

>> during compilation <<
** Notice: the var keyword has been compiled away **
a;      // undefined
b;      // undefined
a = b;
b = 2;
b;      // 2
a;      // undefined

>> after compilation <<

??

*/

      ////////// [end "hoisting in js" reference] //////////

// ..Engine/Scope Conversation
function foo(a) {
  console.log( a ); // 2
}

foo ( 2 );
/*
Engine: hey scope, i have an RHS reference for foo.. heard of it?
Scope: why yes, i have.. Compiler declared it just a second ago.. its a function..tomaa!
Engine: thx .. im executing foo
Engine: hey scope, ive got an LHS reference for "a", ever heard of it?
Scope: why yes, i have.. Compiler declared it as a formal parameter to foo just recently.. tomaa!
Engine: helpful as always, Scope. thanks again. now, time to assign 2 to a.
Engine: hey, scope, sorry to bother you again. i need sn RHS lookup for console. ever heard of it?
Scope: no problem, Engine, this is what i do all day. yes, i've got console. it's built-in. here ya go.
Engine: perfect. looking up log(..). ok, great, it's a function.
Engine: yo, scope. can you help me out with an RHS reference to 'a'. I think i remember it, but just want to double-check.
Scope: you're right, Engine. same variable, hasn't changed. here ya go.
Engine: Cool. passing the value of 'a', which is 2, into log(..).
*/

//Quiz: play the part of Engine and have convo w/ scope
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo( 2 );

/*
LHS look-ups
- c = ..;
- a = 2 (implicit param assignement)
- b = ..;

RHS look-ups
- foo(2..
- = a;
- a + b
*/

// ..Nested Scope
function foo(a){
  console.log( a + b);
}

var b = 2;

foo( 2 ); // 4

// RHS referene for b cannot be resolved inside the function foo, but can be resolved in the scope around it (global)

/*
Engine: hey, Scope of foo, ever heard of b? got an RHS reference for it.
Scope(foo): nope, never heard of it. go fish
Engine: hey, scope outside of foo, oh you're the global scope, OK cool. ever heard of b? got an RHS reference for it
Scope(global): yep, sure have. here ya go
*/

// ..Building on Metaphors
// to visualize the process of nested scope resolution, this of this tall building

// ..Errors
/*
why does it matter whether we call it LHS or RHS? because these two types of look-ups behave differently in the circumstance where the variable has not yet been declared (is not found in any consulted scope)

if an RHS look-up fails to ever find a variable, anywhere in the nested scope, this results in a ReferenceError being thrown by the Engine

if the Engine is performing an LHS look-up, and arrives at the top floor (global scope) without finding it, if the program is running in "Strict Mode", then the global scope will vreate a new variable if the name in the global scope, and hand it back to Engine.

Strict Mode .. disallows the automatic/implicit global variable creation. .. there would be no global scoped variable to hand back from an LHS look-up, and the Engine would throw a RefernceError..

if a variable is found for an RHS look-up, but you try to do something with its value that is impossible .. then Engine throws .. a TypeError

**ReferenceError is scope resolution-failure related, whereas TypeError implies that scope resolution was successful, but there was an illegal/impossible action attempted against the result
*/

// .Lexical Scope
// each function creates a new bubble of scope
                      // bubble 1: global scope.. 1 identifier: foo
function foo(a) {     // bubble 2: scope of foo.. 3 identifiers: a, bar, b
  
  var b = a * 2;
  
  function bar(c) {   // bubble 3: scope of bar.. 1 identifier: c  
    console.log( a, b, c );
  }
  
  bar( b * 3 );
}

foo( 2 ); // 2, 4, 12

// ..Look-ups
// scope look-ups stops once it finds the first match.. the inner identifier "shadows" the outer identifier

// >>> [end reference]

// ..Lexical Scope (cont.)
var hero = aHero();
var newSaga = function() {
  var foil = aFoil();
  var saga = function() {
    var deed = aDeed();
    log(hero+deed+foil);
  };
};
newSaga();
newSaga();
//log(hero);

// ..In-Memory Data Stores
// Execution Contexts
var hero = aHero();
var newSaga = function() {
  var foil = aFoil();
  var saga = function() {
    var deed = aDeed();
    log(hero+deed+foil);
  };
  saga();
  saga();
};
newSaga();
newSaga();

// ..In-Memory Scopes vs In-Memory Objects
// ..Predicting Execution Context Output
// ..Building Multiple Execution Contexts
// ..Continuing Output Predictions

// .Closures
// ..Retaining Access to Functions
var sagas = [];
var hero = aHero();
var newSaga = function() {
  var foil = aFoil();
  sagas.push(function(){
    var deed = aDeed();
    log(hero+deed+foil);
  });
};
newSaga();
sagas[0]();
sagas[0]();
newSaga();
// ..Predicting Execution Contexts
// ..Prediction Closure Output

      ////////// [begin "Scope Closure" reference] //////////

// .Scope Closure
// ..Nitty Gritty
// Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope
function foo() {
  var a = 2;
  
  function bar() {
    console.log( a ); // 2
  }
  
  bar();
}

foo();

// closure in full light
function foo() {
  var a = 2;
  
  function bar() {
    console.log( a );
  }
  
  return bar;
}

var baz = foo();

baz(); // 2 -- whoa, closure was just observed, man

// Closure lets the function (bar()) continue to access the lexical scope it was defined in at author time

//.. any of the various ways that functions can be passed around as values, and indeed invoked in other locations, are all examples of observing/exercising closure

//var fn;

function foo(){
  var a=2;
  
  function baz(){
    console.log(a); // 2
  }
  
  bar(baz);
}

function bar(fn){
  fn(); // look ma, i saw closure 
// ?? why recieve TypeError: undefined is not a function
}

// ..passings-around of functions can be indirect, too
var fn;

function foo(){
  var a=2;
  
  function baz(){
    console.log(a);
  }
  
  fn = baz; // assign baz to global var
}

function bar(){
  fn(); // look ma, i saw closure 
}

foo();

bar();

      ////////// [end "Scope Closure" reference] //////////

// ..Prediction Closure Output (cont)
var sagas = [];
var hero = aHero();
var newSaga = function() {
  var foil = aFoil();
  sagas.push(function(){
    var deed = aDeed();
    log(hero+deed+foil);
  });
};
newSaga();
sagas[0]();
sagas[0]();
newSaga();
sagas[0]();
sagas[1]();
sagas[0]();











