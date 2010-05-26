$(document).ready(function(){

    s1 = [2, 6, 7, 10];
    s2 = [7, 5, 3, 2];
    s3 = [14, 9, 3, 8];
    
    ticks = ['a', 'b', 'c', 'd'];
    
    s5 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    
    plot1 = $.jqplot('chart1', [s1], {
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            }
        },
        highlighter: { show: false }
    });
    
    plot2 = $.jqplot('chart2', [s1, s2], {
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            }
        }
    });
    
    plot2b = $.jqplot('chart2b', [[[2,1], [4,2], [6,3], [3,4]], [[5,1], [1,2], [3,3], [4,4]]], {
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer,
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal'
            }
        },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
    
    plot3 = $.jqplot('chart3', [s1, s2, s3], {
        stackSeries: true,
        captureRightClick: true,
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                highlightMouseDown: true    
            }
        },
        legend: {
            show: true,
            location: 'e',
            placement: 'outside'
        }      
    });

    plot6 = $.jqplot('chart6', [[1,2,3,4]], {seriesDefaults:{highlighter:{show:true}}});
    
    $('#chart1').bind('jqplotDataClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );
    
    $('#chart2').bind('jqplotDataHighlight', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info2').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );
    
    $('#chart2').bind('jqplotDataUnhighlight', 
        function (ev) {
            $('#info2').html('Nothing');
        }
    );
    
    $('#chart2b').bind('jqplotDataHighlight', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info2b').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
        }
    );    
    $('#chart2b').bind('jqplotDataClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info2c').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
        }
    );
    
    $('#chart2b').bind('jqplotDataUnhighlight', 
        function (ev) {
            $('#info2b').html('Nothing');
        }
    );
    
    $('#chart3').bind('jqplotDataRightClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info3').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );  
    
    $(document).unload(function() {$('*').unbind(); });
});