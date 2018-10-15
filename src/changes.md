# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) from version _1.0.9_ onwards.

## [Unreleased]
### Changed
- Formatting of _changes.txt_ changelog to the recommended formatting.
- Renamed changes.txt to changes.md.
- Fix enhancedLegendRenderer element hide mismatch - By Daniel G (@dg-spark)

## [1.0.9] - 2016-02-16
### Added
- Add "step" chart style.
- Add enhancedPieLegendRenderer.

### Changed
- Fix typos in code where draggable mispelled as "dragable".
- Convert toolchain to grunt.
- Refactor code according to JSLint rules - By Johan Bové (@johanbove) in PR #11.
- Fix checkIntersection issue - By Daniel G (@dg-spark) in PR #8.
- Fix infinite loop - By Maarten Bezemer (@veger) in PR #17.
- Display total amount of items in the center of a donut chart in - By Jens (@jeschr) in PR #20.
- new "totalLabel" rendererOption for donut renderer - By Stefan Meyer (@spoonguard2k) in PR #21.
- Update jqplot.pointLabels.js - By Stefan Meyer (@spoonguard2k) in PR #22.
- Update jqplot.pieRenderer.js - By Stefan Meyer (@spoonguard2k) in PR #23.
- barRenderer resizing fix - By Stefan Meyer (@spoonguard2k) in PR #25.
- Error resizing horizontal bar charts - By Stefan Meyer (@spoonguard2k) in PR #26.

___Note:__ Issues and PRs refer to the old Bitbucket project from here on._

## [1.0.8] - 2013-03-27
### Added
- Issue #523: Adding rectangles to Canvas Overlay plugin.
- PR #23: Adding rectangles to Canvas Overlay plugin.
- PR #41: Add dutch(nl) and svenska(sv) translations for dates.
- Add tooltip support for Pie Charts.

### Changed
- Update to latest YUI compressor.
- Issue #375: sortMergedLabels does not sort string labels.
- Issue #279: Groups > 3 Causes Alignment Issues.
- Issue #439: IE can't display a customized legend in Quirks mode.
- Issue #482: "Undefined" error message when plotting a chart with no data.
- Issue #116: Don't mix spaces and tabs for indentation.
- Issue #564: Metergauge renderer not resizable when replotting.
- Issue #409: MeterGaugeRenderer replot/redraw offsets center.
- Issue #756: jqplot.min files contain non-UTF-8 characters.
- Issue #223: fillToZero does not color negative values when crossover point is 0.
- PR #28: Cross-over points of 0 will actually change colors.
- PR #35: Don't highlight hidden bars or show tooltips for them.

## [1.0.7] - 2013-02-26
### Added
- PR #18: Implement getTop in CanvasAxisTickRenderer.
- PR #24: Added suggested fix in comment #8 for issue #536.

### Changed
- Issue #726: Bug in sprintf %p, sometimes it outputs exponential form rather than decimal.
- Issue #717: Plot's preDrawHooks not called.
- Issue #707: Browser hangs with LogAxisRenderer when value is 0.
- Issue #695: Horizontal Bar Chart Negative Series Colors Not Working.
- Issue #670: Examples IE7, IE8 and IE9 multipleBarColors.html failure and fix.
- Issue #636: X Axis Date Renderer Single Day Not plotting.
- Issue #607: Integration issue.
- Issue #571: Decimal numbers not properly formatted.
- Issue #552: jqPlot crashes when interval too small.
- Issue #536: DateAxisRenderer invalid scaling.
- Issue #534: "decimalMark" in the "jqplot.sprintf.js".
- Issue #529: Scientific notation on label values ending in 0.
- Issue #521: invalid JS in meterGaugeRenderer.js.
- Issue #516: Including BezierCurveRenderer plugin and initializing jqplot with no options give error.
- Issue #500: DateAxisRenderer has timezone related issues.
- Issue #452: Including ALL jqPlot plugins causes an Error.
- Issue #494: No point when use LogAxisRenderer and a point has a zero value.
- Issue #430: getIsoWeek: invalid method call.
- Issue #280: jqplot Options.
- Issue #179: Spelling/grammar.
- PR #21: Performance issue when drawing pointlabels with zeros/null values.
- PR #29: Removed unbalanced addition of UTC offset.
- PR #33: Documentation fixes (issue #179, other changes).
- PR #34: Start of updating jqPlotOptions.txt.
- PR #37: Example and suggested fix for issues #552 and issue #536.
- PR #39: Fixed trailing comma which caused issues with IE7.

## [1.0.6] - 2013-02-17 
### Added
- Add left sidebar navigation to examples.
- Add colorpicker.js to distribution.
- Add "minified" copyright notice for minified files, similar to jquery's notice.

### Changed
- Update examples for jquery 1.9.1 and jquery ui 1.10.0.
- Fix some problems with examples when viewing with local file system.
- PR #25: jqplot.sprintf.js is no longer the last file in the concatenated jquery.jqplot.js.
- PR #17: Fixed bug causing custom pointLabels passed with plot data to be ignored for horizontal bar graphs.
- PR #10: Build error by invalid encoding.
- Issue #714: handle tickColor in meterGaugeRenderer.
- Issue #519: jsDate Polish Localization.

## [1.0.5] - 2013-02-11
### Changed
- Updated to jQuery 1.9.

## [1.0.0b2] - 2011-06-22
### Added
- Added vertical and dashed vertical line support for canvas overlay.

### Changed
- Major improvements in memory usage:
 - Merged in changes from Timo Besenruether to reuse canvas elements and improve memory performance.
 - Fixed all identifiable DOM leaks.
 - Mergged in changes from cguillot for memory improvements in IE < 9.
- Fixed bug where initially hidden plots would not display.
- Fixed bug with point labels and null data points.
- Updated to jQuery 1.6.1.
- Improved pie slice margin calculation and fixed slice margin and pie positioning with small slices.
- Improved bar renderer so bars always start at 0 if:
 - The axis is a linear axis (not log/date).
 - There are no other line types besides bars attached to the axis.
 - The data on the axis is all >= 0.
 - The user has not specified a pad, padMin or forceTickAt0 = true option.
- Modified tick prefix behavious so prefix no added to all ticks, even if format string is specified.
- Fix to ensure original tick formats are applied when zooming and resetting zoom.
- Updated auto tick format string so format adjusted when zooming.
- Modified auto tick computation to put less ticks on small plots and moreticks on large plots.
- Update bubble render to support gradients in IE 9.

## [1.0.0b1] - 2011-05-12
### Added
- Added defaultColors and defaultNegativeColors options to $.jqplot.config.
- Added lineJoin and lineCap option to series lines.
- Added looseZoom option to cursor so zooming can produce well rounded ticks.
- Added forceTickAt0 and forceTickAt100 options to ensure there will always be a tick at 0 or 100 in the plot.

### Changed
- Updated to jQuery 1.5.1.
- Much improved tick generation algorithm to get precise rounded  tick values (Thanks Scott Prahl!).
- Auto compute tick format string if none is provided.
- Much better "slicing" of pie charts when using "sliceMargin" option to set a gap between the slices.
- Expanded canvasOverlay plugin to create arbitrary dashed and solid  horizontal and vertical lines on top of plot.
- Fixed issue #318, highlighter & bar renderer incompatability.
- Improve highlighter tooltip positioning with negative bars.
- Fixed #305, mispelling of jqlotDragStart and jqlotDragStop. MUST NOW BIND TO jqplotDragStart and jqplotDragStop.
- Fixed #290, some variables left in global scope.
- Fixed #289, OHLC line widths hard coded at 1.5. Now set by lineWidth option.
- Fixed #296 for determining databounds on log axes.
- Fixed waterfall plot to ensure first and last bars always fill to zero.
- Bar widths now based on width of grid, not plot target for better scaling.
- Fixed bug where cursor legend didn't honor series showLabel option.

## [1.0.0a] - 2011-03-07
### Added
- Series can now be moved forward or backward in stack to e.g. bring a line forward when mousing over a point.
- Can now move outside of grid area while zooming.  Can have zoom constrained to grid area or allow zooming outside.
- Now using feature detection for canvas and canvas text capability rather than browser version.
- Implemented highlighting on bar, pie, donut, funnel, etc. charts.
- Added enhancedLegendRenderer plugin to allow multi row/column legends and clickable labels to show/hide series.
- Added block plot plugin.
- Added funnel type charts.
- Added meter gauge type charts.
- Added plot theming support.
- Added fillToValue option to allow filled line plot to fill to an arbitrary value.
- Added custom error handling to display error message in plot area.
- Added defaultAxisStart option.
- Added gradient fills to bubbles.
- Added bubble charts.
- Added showLabels option to bubble charts.
- Added dataRenderer option to allow custom processors for JSON, AJAX and anywhere else you might want to get data.
- Added tooltipContentEditor option to highlighter, allowing callback to manipulate tooltip content at run time (thanks Tim Bunce!).
- Added canvasOverlay plugin to allow drawing of arbitrary shapes on a canvas over the plot.
- Added option to display arbitrary text/html (message, animated gif, etc.) if plot is constructed without data.  Allow a "data loading" indicator to be shown.
- Added resetAxisValues method to manually update axis ticks without redrawing the plot.
- Added thousands separator character (') to sprintf formatting (thanks yuichi1004!).
- Added experimental support for "broken" axes.
- Added options to place legend outside of grid and shrink grid so everything stays within plot div.
- Added event listener hooks for mouseUp, mouseDown, etc. to all line plots.

### Changed
- Updated to jQuery 1.4.4.
- Fixed issue #142 with tooltip drawn on top of event canvas, hiding mouse events.
- Fixed #147 where pie slices with 0 value not rendering properly in IE.
- Fixed #130 where stack data not sorted properly.
- Fixed bug with null values not handled properly in category axes.
- Fixed #156 where pie charts not rendering on QTWebKit.
- $.jqplot.config.enablePlugins now false by default.
- Fix to pointlabels plugin to align labels properly on multi series plots.
- Fixed issue where would call to draw grid border of 0 width would result in a default border being drawn.
- Fixed bug in color generator so now calls to get() continually cycle through colors just like next().
- Pass bubble radius to event callback in bubble charts.
- Fixed #207, typo in docs.
- Fixed #206 where "value" pie slice data labels were displaying wrong value.
- Fixed #147 with 0 value slices in IE6.
- Fixed issue #241, disabled varyBarColor option in stacked charts.
- Fixed null value handling so plot now properly skip or join over nulls.
- Fixed showTicks and showTickMarks option conflicts.
- Fixed issue #185 where pointLabels plugin incompatibility could crash pie, donut and other plots.
- Fixed #23 and #143 to obey gridPadding option.
- Fixed #233 with highlighter tooltip separator.
- Fixed #224 where type checking failing on GWT.
- Fixed #272 with pie highlighting not working on replot.
- Memory performance improvements.
- Changes to build script so everything should build when pulled from repo.
- Fixed issue #275, IE 6/7 don't support array indexing of strings.
- Fixed bug with highlighter not working when null in data.
- Fixed bug where donut plots showed value of radians of slice instead of actual data.
- Fixed bug where axes scale not resetting.
- Fixed bug with date axes where data bounds not properly set.
- Fixed issue where tick marks disappear if grid lines turned off.
- Updated replot method to allow passing in axes options for more control.
- Fixed bug with pies where pies with 0 valued slices did not draw correctly.
- Fix to labels on negative bars so label position of 'n' will be below a negative bar, just as it is above a positive bar (thanks guigod!).
- Re-factored date parsing/formatting to use new jsDate module which does not
  extend the Date prototype.

### Removed
- Reverted to excanvas r3 so IE8 no longer has to emulate IE7.

## [0.9.7] - 2010-02-01
### Added
- Added Mekko chart plot type with enhanced legend and axes support.
- Implemented vertical waterfall charts.  Can create waterfall plot as option to bar chart. See examples folder of distribution.
- Enhanced plot labels for waterfall style.
- Enhanced bar plots so you can now color each bar of a series independently with the "varyBarColor" option.
- Added additional default series colors.
- Added useNegativeColors option to turn off negative color array and use only seriesColors array to define all bar/filled line colors.

### Changed
- Re-factored series drawing so that each series and series shadow drawnon its own canvas. Allows series to be redrawn independently of each other.
- Re-factored date methods out of dateAxisRenderer so that date formatter and methods can be accesses outside of dateAxisRenderer plugin.
- Fix css for cursor legend.
- Modified shape renderer so rectangles can be stroked and filled.
- Fixed #132, now trigger series change event on plot target instead of drag canvas.
- Fixes issue #116 where some source files had mix of tabs and spaces for indentation.  Should have been all spaces.
- Fixed issue #126, some links broken in docs section of web site.
- Fixed issue #90, trendline plugin incompatibility with pie renderer.
- Updated samples in examples folder of distribution to include navigation links if web server is set up to process .html files with php.


## [0.9.6] - 2009-11-13
### Added
- New, easier to use, replot() method for placing plots in tabs, accordions, resizable containers or for changing plot parameters programmatically.
- Added examples for making plots in jQuery UI tabs and accordions.

### Changed
- Updated legend renderer for pie charts to draw swatches which will print correctly.
- Fixed issue #118 with patch from taum so autoscale option will honor tickInterval and numberTicks options
- Fix to plot diameter calculation for initially hidden plots.
- Fixed issue #120 where pie chart with single slice not displaying correctly in IE and Chrome

## [0.9.5.2] - 2009-MM-DD
### Added
- Added option to turn individual series labels off in the legend.

### Changed
- Fixed #102 where double clicking on plot that has zoom enabled, but
  has not been zoomed resulted in error.
- Fixed bug where candlestick coloring options not working.

## [0.9.5.1] - 2009-10-25
### Added
- Added additional marker styles: plus, X and dash.

### Changed
- Fixed bug where tooltip not working with OHLC and candlestick charts.

## [0.9.5] - 2009-10-23
### Added
- Implemented "zoomProxy". zoomProxy allows zooming one plot from another  such as an overview plot.
- Zooming can now be constrained to just x or y axis.
- Enhanced cursor plugin with vertical "dataTracking" line.  This is a line at the cursor location with a readout of data points at the line location which are displayed in the chart legend.
- Added mechanisms to specify plot size when plot target is hidden or plot height/width otherwise cannot be determined from markup.
- Added $.jqplot.config object to specify jqplot wide configuration options. These include enablePlugins to globally set the default plugin state on/off and defaultHeight/defaultWidth to specify default plot height/width.
- Added fillToZero option which forces filled charts to fill to zero as opposed to axis minimum.  Thus negative filled bar/line values will fill upwards to zero axis value.
- Added option to disable stacking on individual lines.
- Improved tick and body sizing of Open Hi Low Close and candlestick charts.
- Lots of examples were added to a separate examples directory to better show functionality of jqPlot for local testing with the distribution.

### Changed
- Changed cursor tooltip format string.  Now one format string is used for entire tooltip.
- Changed targetId property of the plot object so it now includes a "#" before the id string.
- Many various bug fixes and other minor enhancements.

### Removed
- Removed lots of web site related files from the repository.  This means that, if working from the sources, user's won't be able to build the jqplot web site and the docs/tests that are hosted on that site. The minified and compressed distribution packages will build fine.

## [0.9.4] - 2009-08-06
### Added
- Implemented axis labels. Labels can be rendered in div tags or as canvas 
  elements supporting rotated text.
- Improved rotated axis label positioning so labels will start or end at a
  tick position.
- Added option to legend to encode special HTML characters.
- Added edgeTolerance option to point label renderer to control rendering of  labels near plot edges.

### Changed  
- Fixed bug where an empty data series would hang plot rendering.
- completed issue #66 for misc. improvements to documentation.
- Fixed issue #64 where the same ID's were assigned to cursor and highlighter elements.
- Fixed undesirable behavior where point labels for points off the plot were being rendered.

## [0.9.3] - 2009-07-24
### Added
- Preliminary support for axis labels.  Currently rendered into DIV tags, so no rotated label support. This feature is currently experimental.
- Added examples for new autoscaling algorithm.
- Improved algorithm which controlled maximum number of labels that would display on a category axis.

### Changed
- Fixed bug #52, needed space in tick div tag between style and class declarations  or plot failed in certain application doctypes.
- Fixed issue #54, miter style line join for chart lines causing spikes at steep  changes in slope.  Changed miter style to round.
- Fixed bug #57, category axis labels disappear on redraw()
- Fixed bug #45 where null values causing errors in plotData and gridData.
- Fixed issue #60 where seriesColors option was not working.

## [0.9.2] - 2009-07-17
### Changed
- Fixed bug #45 where a plot could crash if series had different numbers of points.
- Fixed issue #50, added option to turn off sorting of series data. 
- Fixed issue #31, implemented a better axis autoscaling algorithm and added an autoscale option.

## [0.9.1] - 2009-07-15
### Changed
- Fixed bug #40, when axis pad, padMax, padMin set to 0, graph would fail to render.
- Fixed bug #41 where pie and bar charts not rendered correctly on redraw().
- Fixed bug #11, filled stacked line plots not rendering correctly in IE.
- Fixed bug #42 where stacked charts not rendering with string date axis ticks.
- Fixed bug in redraw() method where axes ticks were not reset.
- Fixed "jqplotPreRedrawEvent" that should have been named "jqplotPostRedraw" event.

## [0.9.0] - 2009-07-14
### Added
- Added Open Hi Low Close charts, Candlestick charts and Hi Low Close charts.
- Added support for arbitrary labels on the data points.
- Enhanced highlighter plugin to allow custom formatting control of entire tooltip.
- Enhanced highlighter to support multiple y values in a data point.
- Improvements to examples to show what plugins to include.
- Expanded documentation for some of the plugins.

### Changed
- Fixed bug #38 where series with a single point with a negative value would fail.

## [0.8.5] - 2009-06-29
### Added
- Added zooming ability with double click or single click options to reset zoom.
- Added double click event handler on plot.
- Added neighborThreshold option to control how close mouse must be to point to trigger neighbor detection.

### Changed
- Fixed bug #2 where tickInterval wasn't working properly.
- Modified default tick spacing algorithm for date axes to give more space to ticks.

## [0.8.0] - 2009-06-24
### Added
- Support for up to 9 y axes.
- Added option to control padding at max/min bounds of axes separately.
- Closed issue #21, added options to control grid line color and width.
- Closed issue #20, added options to filled line charts to stoke above fill and customize fill color and transparency.
- Improved structure of on line documentation to make usage and options docs default.
- Added much documentation on options and css styling.

## [0.7.1] - 2009-06-18
### Changed
- Bug fix release
- Fixed bug #6, missing semi-colons messing up some javascript compressors.
- Fixed bug #13 where 2D ticks array of [values, labels] would fail to renderer with DateAxisRenderer.
- Fixes bug #16 where pie renderer overwriting options for all plot types and crashing non pie plots.
- Fixes bug #17 constrainTo dragable option mispelled as "contstrainTo".
- Fixed dragable color issue when used with trend lines.

## [0.7.0] - 2009-07-15
### Added
- Pie chart support
- Enabled tooltipLocation option in highlighter. 
- Highlighter Tooltip will account for mark size and highlight size when positioning itself. 
- Added ability to show just x, y or both axes in highlighter tooltip.
- Added customization of separator between axes values in highlighter tooltip.
- Added a ColorGenerator class to robustly return next available color for a plot with wrap around to first color at end.
- Added cursor changes in dragable plugin when cursor near dragable point.

### Changed
- Modified how shadows are drawn for lines, bars and markers. Now drawn first, so they are always behind the object.
- Adjustments to shadow parameters on lines to account for new shadow positioning.
- Udates to docs about css file.
- Fixed bug with String x values in series and IE error on sorting (Category Axis).

## [0.6.6b] - 2009
### Added
- Added excanvas.js and excanvas.min.js to compressed distributions.
- Added example/test html pages I had locally into repository and to compressed distributions.

## [0.6.6a] - 2009
Duplicate of 0.6.6 with a suffix to unambiguously differentiate between previously posted 0.6.6 release.

### Removed
- Removed absolute positioning from dom element and put back into css file.

## [0.6.6] - 2009-06-10
### Added
- Added absolute position css spec to axis tick dom element.
### Changed
- Fixed bug #5, trend line plugin failing when no trend line options specified.
- Enhancement to category axes, more intuitive handling of series with missing data values.

## [0.6.5] - 2009-06-09
### Changed
- Fixed bug #4, series of unequal data length not rendering correctly.  
  This is a bugfix release only.

## [0.6.4] - 2009-06-08
### Changed
- Fixed bug (issue #1 in tracker) where flat line data series (all x and/or y 
  values are euqal) or single value data series would crash.

## [0.6.3] - 2009-06-07
### Added
- Added info (contacts & support information) page to web site.
- Support for stacked line (a.k.a. area) and stacked bar (horizontal and vertical) charts.

### Changed
- Refactored barRenderer to use default shape and shadow renderers.

## [0.6.2] - 2009-06-02
### Added
- Ant build script generates entire site, examples, tests and distribution.

### Changed
- This is a minor upgrade to docs and build only. No functionality has changed.
- Improvements to documentation.

## [0.6.1] - 2009-06-01
### Added 
- New sprintf implementation from Ash Searle that implements %g.
- Created new format specifier, %p and %P to preserve significance.
- Added option to have cursor tooltip follow the mouse or not.
- Added options to change size of highlight.
- Added license and copyright statement to source files.

### Changed
- Fix to sprintf e/f formats.
- Modified p/P format to better display larger numbers.
- Fixed and simplified significant digits calculation for sprintf.
- Updates to handle dates like '6-May-09'.
- Mods to improve look of web site.
- Updates to documentation.

## [0.6.0] - 2009-05-18
### Added
- Added rotated text support.  Uses native canvas text functionality in 
  browsers that support it or draws text on canvas with Hershey font
- metrics for non-supporting browsers.

### Changed
- Moved tick css from js code into css file.
- Fix to tick positioning css.  y axis ticks were positioned to wrong side of axis div.
- Re-factored axis tick renderer instantiation into the axes renderers themselves.

### Removed
- Removed lots of lint in js code.

---
__Note:__ For changes prior to 0.6.0 release, please see change log at <https://github.com/Slicer/jqplot/releases?after=0.6.0>
---
