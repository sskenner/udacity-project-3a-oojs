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
