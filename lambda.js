/*
 * $Id: lambda.js,v 0.2 2013/04/04 16:19:55 dankogai Exp dankogai $
 *
 * lambda.js
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */
(function(ctx) {
    'use strict';
    var parse = function(src, lv) {
        var body = '', idx, m, i, d, l;
        while (m = src.match(/^([\s\S]*?)(lambda|λ)\(/)) {
            body += m[1];
            src = src.substr(m[0].length-1);
            for (i = d = 1, l = src.length; i < l; ++i) {
                if      (src.charAt(i) === '(') d++;
                else if (src.charAt(i) === ')') d--;
                if (!d) break;
            };
            if (i === l) throw new SyntaxError('() mismatch');
            var t = src.substr(1,i-1);
            body += lambda(t, true, lv+1);
            src = src.substr(i+1);
        }
        return body + src;
    };
    function lambda(src, nomemo, lv) {
        if (!nomemo && src in lambda.memo) return lambda.memo[src];
        if (!lv) lv = 0;
        var parts = src.match(/^([^:]*):([\s\S]+)/),
        head = parts[1],
        body = parse(parts[2], lv);
        var fun = eval(
            '(function _' + (lv) + '('+head+'){return '+body+'})'
        );
        if (!nomemo) lambda.memo[src] = fun;
        return fun;
    };
    lambda.memo = {};
    ctx.λ = ctx.lambda = lambda;
})(this);
