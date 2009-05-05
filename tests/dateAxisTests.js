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
        plot10.axes.xaxis.tickInterval.should.be '1 month'
        plot10.axes.xaxis.numberTicks.should.be 7
    end
end