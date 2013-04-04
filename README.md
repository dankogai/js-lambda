[![build status](https://secure.travis-ci.org/dankogai/js-lambda.png)](http://travis-ci.org/dankogai/js-lambda)

js-lambda
=========

DSL for, but not limited to, the lambda calculus.

USAGE
-----

### In Browser

````html
<script src="lambda.js" charset="UTF-8"></script>
````

### node.js

````javascript
var lambda = require('./lambda.js').lambda,
λ = lambda;
````

SYNOPSIS
--------

````javascript
lambda("x:x")(42) === 42;
λ("x:x")(42) === 42;                        // λ = lambda
λ("n:n<=1?n:n*_0(n-1)")(10) === 3628800;    // _0 for recursion
λ("x,y:Math.sqrt(x*x+y*y)")(3,4) === 5;     // multiple arguments, 
λ("x:λ(y:Math.sqrt(x*x+y*y))")(3)(4) === 5; // λ can be nested
````
````javascript
// church numerals
var cn2num = λ("f:f(λ(n:n+1))(0)"),
succ = λ("n:λ(f:λ(x:f(n(f)(x))))"),
zero = λ("f:λ(x:x)"),
one = succ(zero),
add = λ("m:λ(n:m("+succ+")(n))"),
two = add(one)(one),
mul = λ("m:λ(n:m("+add+"(n))("+zero+"))"),
four = mul(two)(two),
pow = λ("b:λ(e:e(b))"),
sixteen = pow(two)(four);
cn2num(sixteen) === 16;
````

DESCRIPTION
-----------

This script exports `lambda()` and its alias `λ()`.  As seen in the synopsis, it is a DSL compiler that returns a function.

### the lambda notation

As seen in [SYNOPSYS](#synopsis), 

`lambda(`*arg0,arg1,...argn*:*expression*`)`

Turns into:

`function(`*arg0, arg1, ...argn*`){return ` *expression* `}`

### nesting and recursion

As seen in [SYNOPSYS](#synopsis), the lambda can be nested.

````javascript
λ('x:λ(y:Math.sqrt(x*x+y*y))');
````

Turns into:

````javascript
function _0(x){return function _1(y){return Math.sqrt(x*x+y*y)}}
````

As seen above, the function is named accordingly to [De Bruijin index]. `_`*n* is the nth level function.

[De Bruijin index]: http://en.wikipedia.org/wiki/De_Bruijn_index

Use the name to implement self-recursion.  The strict mode has deprived us of beloved `arguments.callee` but with lambda.js, it is as short as `_0`.

````javascript
// function fact(n){ return n <= 1 ? n : n * fact(n-1) }
λ("n:n<=1?n:n*_0(n-1)");
````

### limitation

To use lexical functions, you have to "interpolate".

````javascript
var succ = λ("n:λ(f:λ(x:f(n(f)(x))))"),
add = λ("m:λ(n:m("+succ+")(n))");	// λ("m:λ(n:m(succ)(n))") does not work
````

This is because `lambda()` needs to `eval()` to compile the function but lexicals are out of its scope.

### memoization

By default, the compiled function is [memoized].  Suppose you have:

[memoized]: http://en.wikipedia.org/wiki/Memoization

````javascript
function rms(ary) {
    return Math.sqrt(ary.reduce(λ("t,x:t+x*x"), 0))
}
````

And you use `rms` over and over, the same function is used throughout the session.  If that is not what you want, you can suppress it by passing truish value to the second argument:

````javascript
var uncached = lambda("a,b,c:...", true);
````

And if you wish, you can inspect cached functions via `lambda.memo`.


SEE ALSO
--------

+ http://docs.python.org/2/tutorial/controlflow.html#lambda-forms
+ http://www.ruby-doc.org/core-2.0/Kernel.html#method-i-lambda
+ http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax
