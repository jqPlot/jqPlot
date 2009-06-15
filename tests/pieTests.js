describe 'jqPlot Pie Charts'
    it plot1.title.text
        plot1.seriesCanvas.should.have_property '_elem'
    end
    it plot2.title.text
        plot2.seriesCanvas.should.have_property '_elem'
    end
    it plot3.title.text
        plot3.seriesCanvas.should.have_property '_elem'
    end
end