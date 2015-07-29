// *OOJS
// .Prototypal Classes
// ..Improving Performance
// use prototype chains

// ..One option for Improving Performance

// ..Delegation Relationships
// use 'Object.create()' technique

// ..Constructor Prototypes
// steps:
// 1)  a function that allows u to make instances
// 2) line in function that generates new instance obj
// 3) delegation from the new obj to some prototype obj
// 4) some logic for augmenting the obj with properties that make it unique from all the other objs of the same class  

// ..How prototypes affect in-memory model

// .. .prototype vs .method

// .. .prototype ambiguity
// prototype describes the methods conatiner that is available on every function

// .. .prototype.constructor
// the .constructor property points back to the function that it came attached to .. can figure out which constructor function built a certain object .. all instances of a class delegate their failed look-ups to their prototype

// ..7q - instanceof operator
var Dog = function() {
  return { legs: 4, bark: alert };
};

var fido = Dog();

console.log(fido instanceof Dog);
//> false