jQPlot
======
Pure JavaScript plotting plugin for jQuery.

[![Join the chat at https://gitter.im/jqPlot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jqPlot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**jqPlot home page**: http://www.jqplot.com.

**Users forum**: http://groups.google.com/group/jqplot-users.

**Developers forum**: http://groups.google.com/group/jqplot-dev.

**Examples and unit tests**: http://www.jqplot.com/examples.

**Documentation**: http://www.jqplot.com/docs/.

**Project page and source code**: http://www.gibhub.com/jqPlot/jqPlot.

**Bugs, issues, feature requests**: http://www.github.com/jqPlot/jqPlot/issues.

# Basic Usage Instructions:

jqPlot requires jQuery (1.4+ required for certain features). jQuery 1.9.1 is included in the distribution.  To use jqPlot, include jQuery, the jqPlot jQuery plugin, the jqPlot css file and optionally the excanvas script to support IE version prior to IE 9 in your web page:

    <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->
    <script language="javascript" type="text/javascript" src="jquery-1.9.1.min.js"></script>
    <script language="javascript" type="text/javascript" src="jquery.jqplot.min.js"></script>
    <link rel="stylesheet" type="text/css" href="jquery.jqplot.css" />

For more information, see the [documentation](http://www.jqplot.com/docs) and [examples](http://www.jqplot.com/examples).

# Building from source:

If you've cloned the repository, you can build a distribution from source.
You need to have grunt (http://gruntjs.com/) installed.  To build a full 
distribution of jqplot: 

1. Change to the jplot root directory.

2. Install project dependencies with
	> npm install

3. Run Grunt with
	> grunt


# Legal Notices:

Copyright (c) 2009-2015 Chris Leonello

jqPlot is currently available for use in all personal or commercial projects 
under both the MIT and GPL version 2.0 licenses. This means that you can 
choose the license that best suits your project and use it accordingly. 

jqPlot includes date instance methods and printf/sprintf functions by other authors:

**Date instance methods**:

    author Ken Snyder (ken d snyder at gmail dot com)
    date 2008-09-10
    version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
    license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)

**JavaScript printf/sprintf functions**.

    version 2007.04.27
    author Ash Searle
    http://hexmen.com/blog/2007/03/printf-sprintf/
    http://hexmen.com/js/sprintf.js
    The author (Ash Searle) has placed this code in the public domain:
    "This code is unrestricted: you are free to use it however you like."
