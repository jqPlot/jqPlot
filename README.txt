Title: jqPlot Readme

Pure JavaScript plotting plugin for jQuery.

Copyright (c) 2009 - 2010 Chris Leonello
jqPlot is currently available for use in all personal or commercial projects 
under both the MIT and GPL version 2.0 licenses. This means that you can 
choose the license that best suits your project and use it accordingly. 

Although not required, the author would appreciate an email letting him 
know of any substantial use of jqPlot.  You can reach the author at: 
chris at jqplot  or see http://www.jqplot.com/info.php .

If you are feeling kind and generous, consider supporting the project by
making a donation at: http://www.jqplot.com/donate.php .

jqPlot includes date instance methods and printf/sprintf functions by other authors:

Date instance methods:

    author Ken Snyder (ken d snyder at gmail dot com)
    date 2008-09-10
    version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
    license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)

JavaScript printf/sprintf functions.

    version 2007.04.27
    author Ash Searle
    http://hexmen.com/blog/2007/03/printf-sprintf/
    http://hexmen.com/js/sprintf.js
    The author (Ash Searle) has placed this code in the public domain:
    "This code is unrestricted: you are free to use it however you like."

To learn how to use jqPlot, start with the Basic Unsage Instructions below.  Then read the
usage.txt and jqPlotOptions.txt files included with the distribution.

The jqPlot home page is at <http://www.jqplot.com/>.

Downloads can be found at <http://bitbucket.org/cleonello/jqplot/downloads/>.

The mailing list is at <http://groups.google.com/group/jqplot-users>.

Examples and unit tests are at <http://www.jqplot.com/tests/>.

Documentation is at <http://www.jqplot.com/docs/>.

The project page and source code are at <http://www.bitbucket.org/cleonello/jqplot/>.

Bugs, issues, feature requests: <http://www.bitbucket.org/cleonello/jqplot/issues/>.

Basic Usage Instructions:

jqPlot requires jQuery (1.4+ required for certain features). jQuery 1.4.1 is included in 
the distribution.  To use jqPlot include jQuery, the jqPlot jQuery plugin, the jqPlot css file and 
optionally the excanvas script for IE support in your web page...

> <!--[if IE]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->
> <script language="javascript" type="text/javascript" src="jquery-1.4.2.min.js"></script>
> <script language="javascript" type="text/javascript" src="jquery.jqplot.min.js"></script>
> <link rel="stylesheet" type="text/css" href="jquery.jqplot.css" />

For usage instructions, see <jqPlot Usage> in usage.txt.  For available options, see
<jqPlot Options> in jqPlotOptions.txt.

Building from source:

To build a distribution from source you need to have ant <http://ant.apache.org> 
installed.  There are 6 targets: clean, dist, min, tests, docs and all.  Use

> ant -p

to get a description of the various build targets. 
