// prototypal classes
// .delegation relationships
// > library.js
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

// > run.js
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
                                     
//*************************************

                                     