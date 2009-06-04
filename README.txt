Title: jqPlot Readme

Pure JavaScript plotting plugin for jQuery.

Copyright (c) 2009 Chris Leonello
This software is licensed under the GPL version 2.0 and MIT licenses.

The jqPlot home page is at <http://www.jqplot.com/>.

Downloads can be found at <http://bitbucket.org/cleonello/jqplot/downloads/>.

The mailing list is at <http://groups.google.com/group/jqplot-users>.

Examples and unit tests are at <http://www.jqplot.com/tests/>.

Documentation is at <http://www.jqplot.com/docs/>.

The project page and source code is at <http://www.bitbucket.org/cleonello/jqplot/>.

Bugs, issues, feature requests: <http://www.bitbucket.org/cleonello/jqplot/issues/>.

To build a distribution from source you need to have ant <http://ant.apache.org> 
installed.  There are 6 targets: clean, dist, min, tests, docs and all.  Use

> ant -p

to get a description of the various build targets. 

jqPlot requires jQuery (tested with 1.3.2 or better). jQuery 1.3.2 is included in 
the distribution.  To use jqPlot include jQuery, the jqPlot jQuery plugin, and 
optionally the excanvas script for IE support in your web page...

> <!--[if IE]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->
> <script language="javascript" type="text/javascript" src="jquery-1.3.2.min.js"></script>
> <script language="javascript" type="text/javascript" src="jquery.jqplot.min.js"></script>

Much of the graph styling is handled by CSS.  You should include the jqplot 
css file in your code as well...

> <link rel="stylesheet" type="text/css" href="jquery.jqplot.min.css" />

jqPlot can be customized by overriding the defaults of any of the objects which make
up the plot.  The general usage of jqplot is...

> chart = $.jqplot('targetElemId', [dataArray,...], {optionsObject});

Which would look like thisin actual code...

> $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);

The optionsObject corresponds to an properties on a <jqPlot> instance, so customization
may look like this...

> chart = $.jqplot('targetElemId', [dataArray, ...], {title:'My Plot', axes:{xaxis:{min:0, max:10}}});
