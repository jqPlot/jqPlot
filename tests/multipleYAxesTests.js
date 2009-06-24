
describe 'Multiple Y axes'
    it plot1.title.text            
        plot1.axes.xaxis.should.have_property '_elem'
        plot1.axes.yaxis.should.have_property '_elem'
        plot1.title.should.have_property '_elem'
        plot1.seriesCanvas.should.have_property '_elem'
    end
    it plot2.title.text            
        plot2.axes.xaxis.should.have_property '_elem'
        plot2.axes.yaxis.should.have_property '_elem'
        plot2.title.should.have_property '_elem'
        plot2.seriesCanvas.should.have_property '_elem'
    end
end