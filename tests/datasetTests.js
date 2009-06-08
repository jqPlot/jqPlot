describe 'Equal Axis Coordinate Values'
    it plot1.title.text            
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.series.should.have_property 'length', 1
    end
    it plot2.title.text            
        plot2.axes.xaxis.should.have_property '_elem'
        plot2.axes.yaxis.should.have_property '_elem'
        plot2.seriesCanvas.should.have_property '_elem'
        plot2.series.should.have_property 'length', 1
    end
    it plot3.title.text            
        plot3.axes.xaxis.should.have_property '_elem'
        plot3.axes.yaxis.should.have_property '_elem'
        plot3.seriesCanvas.should.have_property '_elem'
        plot3.series.should.have_property 'length', 1
    end
    it plot4.title.text            
        plot4.axes.xaxis.should.have_property '_elem'
        plot4.axes.yaxis.should.have_property '_elem'
        plot4.seriesCanvas.should.have_property '_elem'
        plot4.series.should.have_property 'length', 1
    end
end