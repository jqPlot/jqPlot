describe 'Equal Axis Coordinate Values'
    it plot1.title.text            
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.series.should.have_property 'length', 1
    end
    it plot2.title.text            
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.series.should.have_property 'length', 1
    end
    it plot3.title.text            
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.series.should.have_property 'length', 1
    end
end