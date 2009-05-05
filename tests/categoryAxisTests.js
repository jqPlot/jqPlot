describe 'jqPlot Category Axis Renderer Plugin'
    it plot6.title.text
        plot6.axes.xaxis.should.have_property '_elem'
        plot6.seriesCanvas.should.have_property '_elem'
        plot6.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
        plot6.axes.xaxis._ticks[1].label.should.be '1'
        plot6.axes.xaxis._ticks[3].label.should.be '2'
        plot6.axes.xaxis._ticks[5].label.should.be '3'
        plot6.axes.xaxis._ticks[7].label.should.be '4'
        plot6.axes.xaxis._ticks[9].label.should.be '5'
        plot6.axes.xaxis._ticks[11].label.should.be '6'
        plot6.axes.xaxis._ticks[13].label.should.be '7'
    end
    it plot7.title.text
        plot7.axes.xaxis.should.have_property '_elem'
        plot7.seriesCanvas.should.have_property '_elem'
        plot7.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
        plot7.axes.xaxis._ticks[1].label.should.be 'uno'
        plot7.axes.xaxis._ticks[3].label.should.be 'dos'
        plot7.axes.xaxis._ticks[5].label.should.be 'tres'
        plot7.axes.xaxis._ticks[7].label.should.be 'cuatro'
        plot7.axes.xaxis._ticks[9].label.should.be 'cinco'
        plot7.axes.xaxis._ticks[11].label.should.be 'seis'
        plot7.axes.xaxis._ticks[13].label.should.be 'siete'
    end
    it plot8.title.text
        plot8.axes.xaxis.should.have_property '_elem'
        plot8.seriesCanvas.should.have_property '_elem'
        plot8.axes.xaxis.renderer.constructor.should.be $.jqplot.CategoryAxisRenderer
        plot8.axes.xaxis._ticks[1].label.should.be 'uno'
        plot8.axes.xaxis._ticks[3].label.should.be 'due'
        plot8.axes.xaxis._ticks[5].label.should.be 'tre'
        plot8.axes.xaxis._ticks[7].label.should.be 'quattro'
        plot8.axes.xaxis._ticks[9].label.should.be 'cinque'
        plot8.axes.xaxis._ticks[11].label.should.be 'sei'
        plot8.axes.xaxis._ticks[13].label.should.be 'sette'
    end
end