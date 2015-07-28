// *OOJS
// .'this' Keyword
// ..Intro
// will always be called the parameter "this".. cannot rename
// about 5 different ways to bind values to "the parameter this"
// ?? What is the parameter this bound to?

// ..Defining the keyword 'this'
// gets bound to the correct object automatically by the interpreter
// i.e. which object should be focal when invoking a method or a constructor

// ..What is 'this' not bound to?
var fn = function(a,b) {  // (1)
  log(this); // (2)
};

var ob2 = { method: fn};  // (3)


// NOT the function object {f} created @ (1)
// NOT (really) the new instance of the function object { } created @ (1)
// NOT a funtion that is contained within some other object { } as aproperty @ (3)

var obj = { // (4)
  fn = function(a,b) {
    log(this);
  }
};
var ob2 = { method: obj.fn};

obj.fn(3,4); // (5) >> {a:3,b:4}

// NOT the keyword this that appears inside a function that must appear within the curly braces of some "object literal", or some other form of defining a function, so that object literal that surrounds the aforementioned function definition might create a memory object (4)

// NOT an "execution context" or "scope" of the function call (5)

// ..What is 'this' bound to?
/*
the keyword/parameter 'this' is:
- the object that a function is looked up upon when it is being invoked
- (for 90% of the cases) is the object found to the left of the dot where the containing function is called
*/ 

// ..Predicting Parameter Output
var fn = function(one, two) {
  log(one, two);
}
// ** there is no binding for any positional parameters until this function gets called/invoked

var fn = function(one, two) {
  log(one, two);
};
var r={}, g={}, b={};

fn(g, b);     // {} (val of g var aka green obj), {} (val of b var)

// ..Predicting 'this' Output
var fn = function(one, two) {
  log(this, one, two);
};
var r={}, g={}, b={};

fn(g, b);     // <global>, {} (val if g var), {} (val of b var)

// .. 'this' as a paramter of a method invocation
// .. add function as a property of an object
var fn = function(one, two) {
  log(this, one, two);
};
var r={}, g={}, b={};
r.method = fn;

r.method(g, b); // {} (val of r var), {} (val of g var), {} (val of b var)

// specify what 'this' binds to .. overides default to global & left of dot rules
var fn = function(one, two) {
  log(this, one, two);
};
var r={}, g={}, b={}, y={};
r.method = fn;

//fn.call( this, g, b);
r.method.call(y, g, b);     // {} (val of y var), {} (val if g var), {} (val of b var)

// .. how will 'this' get bound within functions when they get passed as callbacks
var fn = function(one, two) {
  log(this, one, two);
};
var r={}, g={}, b={}, y={};
r.method = fn;

setTimeout(fn, 1000); 
// ..Desconstructing setTimeout
// pretend it is defined in a timers.js file
var setTimeout = function(cb, ms) {
  waitSomehow(ms);
  cb(); // setTimeout(fn, 1000); // <global>, undefined, undefined
};
// ..Determining 'this' binding
setTimeout(fn, 1000); 
///
var setTimeout = function(r.method, ms) {
  waitSomehow(ms);
  cb(); // global, undefined, undefined
/// ..losing parameter bindings problem.. FYI .. callback functions are inherently designed so they will be invoked by the system that you pass them to, thus will have very little control over what the bindings will be for the parameters of the functions passed in 
// ..one way to pass a callback without complicating the parameter binding situation is to pass a different function, one that does not receive any parameters at all, then make room in the body of the function for the custom code, and then inside that area reference method and then do the invocation myself
setTimeout(function() {
            r.method(g, b)
          }, 1000); // {} (val of r var), {} (val of g var), {} (val of b var)

// ..Predicting 'this' Output with 'new'
log(one)    // throws error
log(this)   // <global>
///
var fn = function(one, two) {
  log(this, one, two);
};
var r={}, g={}, b={}, y={};
r.method = fn;

new r.method(g, b); // {} (val of v var), {} (val of g var), {} (val of b var) .. a brand new object!


















