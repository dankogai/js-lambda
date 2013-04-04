[![build status](https://secure.travis-ci.org/dankogai/js-lambda.png)](http://travis-ci.org/dankogai/js-lambda)

js-lambda
=========

DSL for λ calculus

USAGE
-----

### In Browser

````html
<script src="list-lazy.js"></script>
````

### node.js

````javascript
var List = require('./list-lazy.js').List;
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
