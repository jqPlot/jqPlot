describe '.init(target, data, options)'
    it 'catch no data specified'
        -{ $.jqplot('chart0', null) }.should.throw_error 'No data specified'
    end

    it 'catch no plot target specified'
        -{ $.jqplot('nada', [[1,2,3,4]]) }.should.throw_error 'No plot target specified'
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
        plot1.series[3].markerRenderer.size.should.equal 14 
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