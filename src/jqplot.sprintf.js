(function($) {    	
    /**
     * sprintf() for JavaScript v.0.4
     *
     * Copyright (c) 2007 Alexandru Marasteanu <http://alexei.417.ro/>
     * Thanks to David Baird (unit test and patch).
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU General Public License as published by the Free Software
     * Foundation; either version 2 of the License, or (at your option) any later
     * version.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
     * details.
     *
     * You should have received a copy of the GNU General Public License along with
     * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
     * Place, Suite 330, Boston, MA 02111-1307 USA
     */

    // 
    // It's prototype is simple:
    // 
    // string sprintf(string format[mixed arg1[, mixed arg2[,...]]])
    // The placeholders in the format string are marked by "%" and are followed by one or more of these elements, in this order:
    // 
    // An optional "+" sign that forces to preceed the result with a plus or minus 
    //   sign on numeric values. By default, only the "-" sign is used on negative numbers.
    // An optional padding specifier that says what character to use for padding (if specified). 
    //   Possible values are 0 or any other character precedeed by a '. The default is to pad with spaces.
    // An optional "-" sign, that causes sprintf to left-align the result of this placeholder. 
    //   The default is to right-align the result.
    // An optional number, that says how many characters the result should have. If the value 
    //   to be returned is shorter than this number, the result will be padded.
    // An optional precision modifier, consisting of a "." (dot) followed by a number, that says 
    //   how many digits should be displayed for floating point numbers. When used on a string, 
    //   it causes the result to be truncated.
    // 
    // A type specifier that can be any of:
    // % - print a literal "%" character
    // b - print an integer as a binary number
    // c - print an integer as the character with that ASCII value
    // d - print an integer as a signed decimal number
    // e - print a float as scientific notation
    // u - print an integer as an unsigned decimal number
    // f - print a float as is
    // p - print a float of given significant digits instead of precision
    // P - print a float of given significant digits instead of precision without padding out trailing zeros.
    // o - print an integer as an octal number
    // s - print a string as is
    // x - print an integer as a hexadecimal number (lower-case)
    // X - print an integer as a hexadecimal number (upper-case)
    // 

    function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return(o.join('')); }

    function calcSigDigits(num, keepint) {
        // keepint = true will force non-significant zeros before a
        // decimal point to be counted as significant.
        keepint = (keepint) ? true : false;
        var count = 0;
        var parts = String(num).split('.');
        var part, i, p;

        if (parts.length == 2) {
            part = parts[1];
            for (i=part.length-1; i>-1; i--) {
                p = part[i];
                if (count == 0) {
                    if (p != '0') count++;
                }
                else count++;
            }
            part = parts[0];
            for (var i=part.length-1; i>-1; i--) {
                p = part[i];
                if (count == 0) {
                    if (!keepint && p != '0') count++;
                    else count++;
                }
                else if (part.length == 1) {
                    if (!keepint && p != '0') count++;
                    else count++;
                }
                else count++;
            }
        }

        else if (parts.length == 1) {
            part = parts[0];
            for (var i=part.length-1; i>-1; i--) {
                p = part[i];
                if (count == 0) {
                    if (!keepint && p != '0') count++;
                    else count++;
                }
                else count++;
            }
        }
        
        if (count<1) count = 1;

        return count;
    };

    $.jqplot.sprintf = function() {
      var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
      while (f) {
        if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
        else if (m = /^\x25{2}/.exec(f)) o.push('%');
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fopPsuxX])/.exec(f)) {
          if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
          if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
            throw("Expecting number but found " + typeof(a));
          switch (m[7]) {
            case 'b': a = a.toString(2); break;
            case 'c': a = String.fromCharCode(a); break;
            case 'd': a = parseInt(a); break;
            case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
            case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
            case 'p': a = m[6] ? parseFloat(a).toPrecision(m[6]) : parseFloat(a); break;
            case 'P':
                var np = m[6];
                if (np) {
                    var b = parseFloat(a).toPrecision(np);
                    var sig = calcSigDigits(b, true);
                    if (sig < np) np = sig;
                    a = parseFloat(a).toPrecision(np);
                }
                else a = parseFloat(a);
                break;
            case 'o': a = a.toString(8); break;
            case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
            case 'u': a = Math.abs(a); break;
            case 'x': a = a.toString(16); break;
            case 'X': a = a.toString(16).toUpperCase(); break;
          }
          a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
          c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
          x = m[5] - String(a).length;
          p = m[5] ? str_repeat(c, x) : '';
          o.push(m[4] ? a + p : p + a);
        }
        else throw ("Huh ?!");
        f = f.substring(m[0].length);
      }
      return o.join('');
    };
})(jQuery);  