(function($) {

    $.fn.jqplotChildText = function() {
        return $(this).contents().filter(function() {
            return this.nodeType == 3;  // Node.TEXT_NODE not defined in I7
        }).text();
    };

    // Returns font style as abbreviation for "font" property.
    $.fn.jqplotGetComputedFontStyle = function() {
        var css = window.getComputedStyle ?  window.getComputedStyle(this[0]) : this[0].currentStyle;;
        var attrs = css['font-style'] 
            ? ['font-style', 'font-weight', 'font-size', 'font-family']
            : ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily'];
        var style = [];

        for (var i=0 ; i < attrs.length; ++i) {
            var attr = String(css[attrs[i]]);

            if (attr && attr != 'normal') {
                style.push(attr);
            }
        }
        return style.join(' ');
    };

    $.fn.jqplotToImage = function(x_offset, y_offset) {

        if ($(this).width() == 0 || $(this).height() == 0) {
            return null;
        }

        // excanvas and hence IE < 9 do not support toDataURL and cannot export images.
        if (!$.jqplot.support_canvas) {
            return null;
        }
        
        var newCanvas = document.createElement("canvas");
        newCanvas.width = $(this).outerWidth() + Number(x_offset);
        newCanvas.height = $(this).outerHeight() + Number(y_offset);

        var newContext = newCanvas.getContext("2d"); 
        newContext.textAlign = 'left';
        newContext.textBaseline = 'top';

        function _jqpToImage(el, x_offset, y_offset) {
            var tagname = el.tagName.toLowerCase();
            var p = $(el).position();
            var css = window.getComputedStyle ?  window.getComputedStyle(el) : el.currentStyle; // for IE < 9
            var left = x_offset + p.left + parseInt(css.marginLeft) + parseInt(css.borderLeftWidth) + parseInt(css.paddingLeft);
            var top = y_offset + p.top + parseInt(css.marginTop) + parseInt(css.borderTopWidth)+ parseInt(css.paddingTop);
            // var left = x_offset + p.left + $(el).css('marginLeft') + $(el).css('borderLeftWidth') 

            if ((tagname == 'div' || tagname == 'span') && !$(el).hasClass('jqplot-highlighter-tooltip')) {
                $(el).children().each(function() {
                    _jqpToImage(this, left, top);
                });
                var text = $(el).jqplotChildText();

                if (text) {
                    newContext.font = $(el).jqplotGetComputedFontStyle();
                    newContext.fillStyle = $(el).css('color');
                    // center text if necessary
                    if ($(el).css('textAlign') === 'center') {
                        left += (newCanvas.width - newContext.measureText(text).width)/2;
                    }
                    newContext.fillText(text, left, top);
                }
            }

            // handle the standard table legend

            else if (tagname === 'table' && $(el).hasClass('jqplot-table-legend')) {
                newContext.strokeStyle = $(el).css('border-top-color');
                newContext.fillStyle = $(el).css('background-color');
                newContext.fillRect(left, top, $(el).innerWidth(), $(el).innerHeight());
                newContext.strokeRect(left, top, $(el).innerWidth(), $(el).innerHeight());



                // find all the swatches
                $(el).find('div.jqplot-table-legend-swatch-outline').each(function() {
                    // get the first div and stroke it
                    var elem = $(this);
                    newContext.strokeStyle = elem.css('border-top-color');
                    var l = left + elem.position().left;
                    var t = top + elem.position().top;
                    newContext.strokeRect(l, t, elem.innerWidth(), elem.innerHeight());

                    // now fill the swatch
                    
                    l += parseInt(elem.css('padding-left'));
                    t += parseInt(elem.css('padding-top'));
                    var h = elem.innerHeight() - 2 * parseInt(elem.css('padding-top'));
                    var w = elem.innerWidth() - 2 * parseInt(elem.css('padding-left'));

                    var swatch = elem.children('div.jqplot-table-legend-swatch');
                    newContext.fillStyle = swatch.css('background-color');
                    newContext.fillRect(l, t, w, h);
                });


                // now add text

                $(el).find('td.jqplot-table-legend-label').each(function(){
                    var elem = $(this);
                    l = left + elem.position().left;
                    t = top + elem.position().top;
                    newContext.font = elem.jqplotGetComputedFontStyle();
                    newContext.fillStyle = elem.css('color');
                    newContext.fillText(elem.text(), l, t);
                });

                elem = null;
            }

            else if (tagname == 'canvas') {
                newContext.drawImage(el, left, top);
            }
        }
        $(this).children().each(function() {
            _jqpToImage(this, x_offset, y_offset);
        });
        return newCanvas;
    };

    $.fn.jqplotSaveImage = function(fmt) {
        var imgCanvas = $(this).jqplotToImage(0,0);
        if (imgCanvas) {
            // if (imgCanvas.mozGetAsFile) {
            //     var f = imgCanvas.mozGetAsFile("test.png");
            //     console.log(f);
            // }
            var imgData = imgCanvas.toDataURL("image/png");
            window.location.href = imgData.replace("image/png", "image/octet-stream");
        }

    };

    $.fn.jqplotViewImage = function(fmt) {
        var imgCanvas = $(this).jqplotToImage(0,0);
        if (imgCanvas) {
            window.open(imgCanvas.toDataURL("image/png"));
        }
    };
    
})(jQuery);
