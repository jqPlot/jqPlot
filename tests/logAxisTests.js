describe 'Log Axis Renderer Plugin Tests' 
    it plot1.title.text
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.title.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
        plot1.axes.yaxis.renderer.constructor.should.equal $.jqplot.LogAxisRenderer
        plot1.axes.yaxis.base.should.equal 10
        plot1.legend.location.should.be 'ne'
        plot1.axes.xaxis.min.should.be 0
        plot1.axes.xaxis.max.should.be 5
        plot1.axes.yaxis.tickDistribution.should.be 'power'
    end
    it plot2.title.text
        plot2.axes.xaxis.should.have_property '_elem'
        plot2.axes.yaxis.should.have_property '_elem'
        plot2.title.should.have_property '_elem'
        plot2.seriesCanvas.should.have_property '_elem'
        plot2.axes.yaxis.renderer.constructor.should.equal $.jqplot.LogAxisRenderer
        plot2.axes.yaxis.base.should.equal 10
        plot2.axes.yaxis.numberTicks.should.equal 7
        plot2.axes.yaxis.min.should.be 1
        plot2.axes.yaxis.max.should.be 64
    end
    
    it plot3.title.text
        plot3.axes.xaxis.should.have_property '_elem'
        plot3.axes.yaxis.should.have_property '_elem'
        plot3.axes.y2axis.should.have_property '_elem'
        plot3.title.should.have_property '_elem'
        plot3.seriesCanvas.should.have_property '_elem'
        plot3.axes.y2axis.renderer.constructor.should.be $.jqplot.LogAxisRenderer
        plot3.axes.y2axis.base.should.equal 10
    end
end