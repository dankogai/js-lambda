/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    // not "var _"; node also aliases _ to global by default
    var lambda = require('../lambda.js').lambda,
    λ = lambda;
}

(function(root){
    'use strict';
    describe('λ', function(){
        it('λ("x:x")(42) === 42;', eq(λ("x:x")(42), 42));
        it('λ("n:n<=1?n:n*_0(n-1)")(10) === 3628800;',
           eq(λ("n:n<=1?n:n*_0(n-1)")(10), 3628800));
        it('λ("x,y:Math.sqrt(x*x+y*y)")(3,4) === 5;', 
           eq(λ("x,y:Math.sqrt(x*x+y*y)")(3,4), 5));
        it('λ("x:λ(y:Math.sqrt(x*x+y*y))")(3)(4) === 5;', 
           eq(λ("x:λ(y:Math.sqrt(x*x+y*y))")(3)(4), 5));
    });
    describe('Church numerals', function(){
        var cn2num = λ("f:f(λ(n:n+1))(0)");
        var succ = λ("n:λ(f:λ(x:f(n(f)(x))))"),
        zero = λ("f:λ(x:x)"),
        one = succ(zero);
        it('cn2num(one) === 1', eq(cn2num(one), 1));
        var add = λ("m:λ(n:m("+succ+")(n))"),
        two = add(one)(one);
        it('cn2num(two) === 2', eq(cn2num(two), 2));
        var mul = λ("m:λ(n:m("+add+"(n))("+zero+"))"),
        four = mul(two)(two);
        it('cn2num(four) === 4', eq(cn2num(four), 4));
        var pow = λ("b:λ(e:e(b))"),
        sixteen = pow(two)(four);
        it('cn2num(sixteen) === 16', eq(cn2num(sixteen), 16));
    });
})(this);
