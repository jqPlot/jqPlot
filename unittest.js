
describe 'jqPlot'
    describe '.init(target, data, options)'
        it 'catch no data specified'
            -{ $.jqplot('chart0', null) }.should.throw_error 'No data specified'
        end

        it 'catch no plot target specified'
            -{ $.jqplot('nada', [[1,2,3,4]]) }.should.throw_error 'No plot target specified'
        end

        it 'catch canvas dimensions <=0'
            -{ $.jqplot('chart0', [[1,2,3,4]]) }.should.throw_error 'Canvas dimensions <=0'
        end
    end
    
    describe 'Line options'
        it plot1.title.text            
            plot1.axes.xaxis.should.have_property '_elem'
            plot1.axes.yaxis.should.have_property '_elem'
            plot1.title.should.have_property '_elem'
            plot1.seriesCanvas.should.have_property '_elem'
            plot1.series.should.have_property 'length', 4
            plot1.series[0].markerRenderer.style.should.equal 'square'
            plot1.series[0].lineWidth.should.be 2
            plot1.series[1].showLine.should.be_false
            plot1.series[1].markerRenderer.style.should.equal 'diamond' 
            plot1.series[2].markerRenderer.style.should.equal 'circle'
            plot1.series[3].lineWidth.should.be 5
            plot1.series[3].markerRenderer.style.should.equal 'filledSquare'
            plot1.series[3].markerRenderer.size.should.equal 11 
            plot1.title.text.should.be 'Line Style Options'
        end
        it plot2.title.text            
            plot2.axes.xaxis.should.have_property '_elem'
            plot2.axes.yaxis.should.have_property '_elem'
            plot2.title.should.have_property '_elem'
            plot2.seriesCanvas.should.have_property '_elem'
            plot2.series.should.have_property 'length', 3
            plot2.series[0].markerRenderer.style.should.equal 'square'
            plot2.series[0].showLine.should.be_false
            plot2.series[2].lineWidth.should.equal 5
            plot2.title.text.should.be 'Mixed Data Lines'
        end
    end
    
    describe 'Shadow options'
        it plot1b.title.text
            plot1b.axes.xaxis.should.have_property '_elem'
            plot1b.axes.yaxis.should.have_property '_elem'
            plot1b.title.should.have_property '_elem'
            plot1b.seriesCanvas.should.have_property '_elem'
        end
    end
    
    describe 'Axes options' 
        it plot3.title.text
            plot3.axes.xaxis.should.have_property '_elem'
            plot3.axes.yaxis.should.have_property '_elem'
            plot3.axes.y2axis.should.have_property '_elem'
            plot3.title.should.have_property '_elem'
            plot3.seriesCanvas.should.have_property '_elem'
            plot3.axes.y2axis.renderer.constructor.should.be $.jqplot.LogAxisRenderer
            plot3.axes.y2axis.base.should.equal 10
            plot3.legend.location.should.be 'e'
            plot3.title.text.should.be 'Secondary Log Axis'
            plot3.axes.xaxis.min.should.be 0
            plot3.axes.xaxis.max.should.be 5
        end
        
        it plot4.title.text
            plot4.axes.xaxis.should.have_property '_elem'
            plot4.axes.yaxis.should.have_property '_elem'
            plot4.title.should.have_property '_elem'
            plot4.seriesCanvas.should.have_property '_elem'
            plot4.axes.yaxis.renderer.constructor.should.equal $.jqplot.LogAxisRenderer
            plot4.axes.yaxis.base.should.equal 10
            plot4.legend.location.should.be 'e'
            plot4.title.text.should.be 'Secondary Log Axis, Power Distribution'
            plot4.axes.xaxis.min.should.be 0
            plot4.axes.xaxis.max.should.be 5
            plot4.axes.y2axis.tickDistribution.should.be 'power'
        end
        
        it plot5.title.text
            plot5.axes.xaxis.should.have_property '_elem'
            plot5.axes.yaxis.should.have_property '_elem'
            plot5.title.should.have_property '_elem'
            plot5.seriesCanvas.should.have_property '_elem'
            plot5.axes.xaxis.min.should.be 0
            plot5.axes.xaxis.max.should.be 5
            plot5.axes.xaxis.numberTicks.should.be 6
            plot5.axes.yaxis.min.should.be -5
            plot5.axes.yaxis.max.should.be 30
            plot5.axes.yaxis.numberTicks.should.be 8
        end
    end
    
    describe 'Category Axis Renderer Plugin'
        it plot6.title.text
            plot6.axes.xaxis.should.have_property '_elem'
            plot1.seriesCanvas.should.have_property '_elem'
            plot6.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
            plot7.axes.xaxis._ticks[0].label.should.be '1'
            plot7.axes.xaxis._ticks[0].label.should.be '2'
            plot7.axes.xaxis._ticks[0].label.should.be '3'
            plot7.axes.xaxis._ticks[0].label.should.be '4'
            plot7.axes.xaxis._ticks[0].label.should.be '5'
            plot7.axes.xaxis._ticks[0].label.should.be '6'
            plot7.axes.xaxis._ticks[0].label.should.be '7'
        end
        it plot7.title.text
            plot7.axes.xaxis.should.have_property '_elem'
            plot1.seriesCanvas.should.have_property '_elem'
            plot7.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
            plot7.axes.xaxis._ticks[0].label.should.be 'uno'
            plot7.axes.xaxis._ticks[0].label.should.be 'dos'
            plot7.axes.xaxis._ticks[0].label.should.be 'tres'
            plot7.axes.xaxis._ticks[0].label.should.be 'cuatro'
            plot7.axes.xaxis._ticks[0].label.should.be 'cinco'
            plot7.axes.xaxis._ticks[0].label.should.be 'seis'
            plot7.axes.xaxis._ticks[0].label.should.be 'siete'
        end
        it plot8.title.text
            plot8.axes.xaxis.should.have_property '_elem'
            plot1.seriesCanvas.should.have_property '_elem'
            plot8.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
            plot8.axes.xaxis._ticks[0].label.should.be 'uno'
            plot8.axes.xaxis._ticks[0].label.should.be 'due'
            plot8.axes.xaxis._ticks[0].label.should.be 'tre'
            plot8.axes.xaxis._ticks[0].label.should.be 'quattro'
            plot8.axes.xaxis._ticks[0].label.should.be 'cinque'
            plot8.axes.xaxis._ticks[0].label.should.be 'sei'
            plot8.axes.xaxis._ticks[0].label.should.be 'sette'
        end
    end

    describe 'Date Axis Renderer Plugin'
        it plot9.title.text
            plot9.axes.xaxis.should.have_property '_elem'
            plot9.seriesCanvas.should.have_property '_elem'
            plot9.axes.xaxis.renderer.constructor.should.be $.jqplot.DateAxisRenderer
        end
        it plot10.title.text
            plot10.axes.xaxis.should.have_property '_elem'
            plot10.seriesCanvas.should.have_property '_elem'
            plot10.axes.xaxis.renderer.constructor.should.be $.jqplot.DateAxisRenderer
            plot10.axes.xaxis.min.should.be Date.create('May 20, 2008').getTime()
            plot10.axes.xaxis.tickInterval.should.be [1, 'month']
            plot10.axes.xaxis.numberTicks.should.be 7
        end
    end

end