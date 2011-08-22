$(document).ready(function(){
    $('script.code').each(function(index) {
        if ($('pre.code').eq(index).length  ) {
            $('pre.code').eq(index).text($(this).html());
        }
        else {
            var str = $(this).html();
            $('div.jqplot-target').eq(index).after($('<pre class="code">'+str+'</pre>'));
        }
    });
    $(document).unload(function() {$('*').unbind(); });

    if (!$.jqplot.use_excanvas) {
        $('div.jqplot-target').each(function(){
            // Add a view image button
            var btn = $(document.createElement('button'));
            btn.text('View as PNG');
            btn.bind('click', {chart: $(this)}, function(evt) {
            evt.data.chart.jqplotViewImage();
            });
            $(this).after(btn);

            // add a save image button
            btn = $(document.createElement('button'));
            btn.text('Save as PNG');
            btn.bind('click', {chart: $(this)}, function(evt) {
            evt.data.chart.jqplotSaveImage();
            });
            $(this).after(btn);
            btn = null;
        });
    }
});