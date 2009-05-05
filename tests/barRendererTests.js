describe 'Bar Renderer Plugin'
    it plot1.title.text
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
        plot1.series[0].renderer.constructor.should.be $.jqplot.BarRenderer
        plot1.series[1].renderer.constructor.should.be $.jqplot.BarRenderer
    end
end