describe 'jqPlot Stacked Bar and Line Charts'
    it 'Stacked Vertical Bar Chart Test'
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
    end
    it 'Stacked Horizontal Bar chart Test'
        plot2.axes.xaxis.should.have_property '_elem'
        plot2.seriesCanvas.should.have_property '_elem'
    end
    it 'Stacked Line Plot (Area Chart) Test'
        plot3.axes.xaxis.should.have_property '_elem'
        plot3.seriesCanvas.should.have_property '_elem'
    end
end