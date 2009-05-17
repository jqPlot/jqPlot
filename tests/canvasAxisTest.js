describe 'Canvas Axis Plugin and Rotated Text'
    it plot1.title.text
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.axes.xaxis.renderer.constructor.should.be $.jqplot.DateAxisRenderer
    end
end