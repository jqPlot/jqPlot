
describe 'jqPlot'
    describe '.init(target, data, options)'
        it 'catch no data specified'
            -{ $.jqplot('chart0', null) }.should.throw_error 'No data specified'
        end

        it 'catch no plot target specified'
            -{ $.jqplot('nada', [[1,2,3,4]]) }.should.throw_error 'No plot target specified'
        end

        it 'catch canvas dimensions <=0'
            -{ $.jqplot('chart1', [[1,2,3,4]]) }.should.throw_error 'Canvas dimensions <=0'
        end
    end
    
    describe 'Line options'
    
        it 'Multiple mixed data lines'
            chart = $.jqplot('chart2', [[[1,1],[1.5, 2.25],[2,4],[2.5,6.25],[3,9],[3.5,12.25],[4,16]],[25, 12.5, 6.25, 3.125], [4, 25, 21, 9]], {
                legend:{show:true},
                title:'Mixed Data Lines',
                series:[{label:'Rising line', showLine:false, markerOptions:{style:'square'}}, {label:'Declining line'}, {label:'Zig Zag Line', lineWidth:5, showMarker:false}]
            })
            chart.axes.xaxis.should.have_property '_elem'
            chart.axes.yaxis.should.have_property '_elem'
            chart.title.should.have_property '_elem'
            chart.seriesCanvas.should.have_property '_elem'
            chart.series.should.have_property 'length', 3
            chart.series[0].markerRenderer.style.should.equal 'square'
            chart.series[0].showLine.should.be_false
            chart.series[2].lineWidth.should.equal 5
            chart.title.text.should.be 'Mixed Data Lines'
        end
    end
    
    describe 'Axes options' 
        it 'Secondary log y axis and options'
            chart = $.jqplot('chart3', [[[1,1],[2,4],[3,9],[4,16]],[25, 12.5, 6.25, 3.125]], {
                legend:{show:true, location:'e'},
                title:'Secondary Log Axis',
                series:[{label:'Rising line'},{yaxis:'y2axis', label:'Declining line'}], 
                axes:{xaxis:{min:0, max:5}, y2axis:{renderer:$.jqplot.LogAxisRenderer, min:2, max:30}}
            })
            chart.axes.xaxis.should.have_property '_elem'
            chart.axes.yaxis.should.have_property '_elem'
            chart.axes.y2axis.should.have_property '_elem'
            chart.title.should.have_property '_elem'
            chart.seriesCanvas.should.have_property '_elem'
            chart.axes.y2axis.renderer.constructor.should.be $.jqplot.LogAxisRenderer
            chart.axes.y2axis.base.should.equal 10
            chart.legend.location.should.be 'e'
            chart.title.text.should.be 'Secondary Log Axis'
            chart.axes.xaxis.min.should.be 0
            chart.axes.xaxis.max.should.be 5
        end
        it 'Secondary log y axis, power distribution'
            chart = $.jqplot('chart4', [[[1,1],[2,4],[3,9],[4,16]],[25, 12.5, 6.25, 3.125]], {
                legend:{show:true, location:'e'},
                title:'Secondary Log Axis, Power Distribution',
                series:[{label:'Rising line'},{yaxis:'y2axis', label:'Declining line'}], 
                axes:{xaxis:{min:0, max:5}, y2axis:{tickDistribution:'power', renderer:$.jqplot.LogAxisRenderer, min:2, max:30}}
            })
            chart.axes.xaxis.should.have_property '_elem'
            chart.axes.yaxis.should.have_property '_elem'
            chart.axes.y2axis.should.have_property '_elem'
            chart.title.should.have_property '_elem'
            chart.seriesCanvas.should.have_property '_elem'
            chart.axes.y2axis.renderer.constructor.should.equal $.jqplot.LogAxisRenderer
            chart.axes.y2axis.base.should.equal 10
            chart.legend.location.should.be 'e'
            chart.title.text.should.be 'Secondary Log Axis, Power Distribution'
            chart.axes.xaxis.min.should.be 0
            chart.axes.xaxis.max.should.be 5
            chart.axes.y2axis.tickDistribution.should.be 'power'
        end
    end

end