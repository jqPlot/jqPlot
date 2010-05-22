$(document).ready(function(){

    $.jqplot.config.enablePlugins = true;

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
        }
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
    
    plot3 = $.jqplot('chart3', [s1, s2, s3], {
        stackSeries: true,
        captureRightClick: true,
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            highlightMouseDown: true
        },
        legend: {
            show: true,
            location: 'e',
            placement: 'outside'
        }      
    });

    plot6 = $.jqplot('chart6', [[1,2,3,4]]);
    
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
    
    $('#chart3').bind('jqplotDataRightClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info3').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );  
    
    $(document).unload(function() {$('*').unbind(); });
});