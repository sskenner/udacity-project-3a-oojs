

/// .Modules (cont)
function CoolModule(id)  {
  function identify()  {
    console.log(id);
  }

  return {
    identify: identify
  };
}
var foo1 = CoolModule( "foo 1" );
var foo2 = CoolModule( "foo 2" );

foo1.identify();
foo2.identify();

// ..name the returned object as the public API
var foo = (function CoolModule(id)  {
  function change() {
    // modifying the public API
    publicAPI.identify = identify2;
  }

  function identify1() {
    console.log( id );
  }

  function identify2() {
    console.log( id.toUpperCase() );
  }

  var publicAPI = {
    change: change,
    identify: identify1
  };

  return publicAPI;
})( "foo module " );

foo.identify();  // foo module
foo.change();
foo.identify();

/// .Modern Modules
// module dependency loaders/managers essentially wrap up this pattern of module definition into a friendly API
var MyModules = (function Manager() {
  var modules = {};

  function define(name, deps, impl) {
    for (var i=0; i<deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    // invoking the definition wrapper function for a module (passing in any dependencies), and storing the return value, the module's API, into an internal list of modules tracked by name
    // with apply()/call() you can set the value of this, and invoke a function as a new method of an existing obj
    modules[name] = impl.apply( impl, deps );
  }

  function get(name) {
    return modules[name];
  }

  return {
    define: define,
    get: get
  };
})();
// ..how it could be used to define some modules
MyModules.define( "bar", [], function() {
  function hello(who) {
    return "let me introduce: " + who;
  }

  return {
    hello: hello
  };
} );

MyModules.define( "foo", ["bar"], function(bar) {
  var hungry = "hippo";

  function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
  }

  return {
    awesome: awesome
  };
} );

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );

console.log(
  bar.hello( "hippo" )
);  // let me introduce: hippo

foo.awesome();  // LET ME INTRODUCE: HIPPO

///. Future Modules
//> bar.js
function hello(who)  {
  return "Let me introduce: " + who;
}

export hello;

//> foo.js
// import only 'hello()' from the "bar" module
import hello from "bar";

var hungry = "hippo";

function awesome() {
  console.log(
    hello( hungry ).toUpperCase()
  );
}

export awesome;

//> baz.js
//  import the entire "foo" and "bar" modules
module foo from "foo";
module bar from "bar";

console.log(
  bar.hello( "rhino" )
);  // let me introduce: rhino

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
















