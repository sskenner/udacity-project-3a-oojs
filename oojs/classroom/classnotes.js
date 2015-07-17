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
LHS (left hand side) - "who is the target of the assignment?" - when var appears on the lefthand side of an assignment operation.. trying to find the variable container itself so that it can assign
RHS (right hand side) - "who is the source of the assignment?" - "retreive his/her source (value)".. "go get the value of..".. more accurately means "not lefthand side"
*/

      //////////// [end sublime] ////////////  

console.log( a );
// reference to 'a' is RHS bc we're looking up to retrieve the value of 'a', so that the value can be passed to console.log( .. ) .. bc nothing is being assigned to here

a = 2;
// LHS reference bc we want to find the variable as a target for the '= 2' assignment operation.. we dont care what the current value is 

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
foo();  // "bar"
bam();  // "yay"
baz();  // Error!



      ////////// [end "hoisting in js" reference] //////////

// >>> [end reference]