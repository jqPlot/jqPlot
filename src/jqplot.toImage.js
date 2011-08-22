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

        x_offset = (x_offset == null) ? 0 : x_offset;
        y_offset = (y_offset == null) ? 0 : y_offset;

        if ($(this).width() == 0 || $(this).height() == 0) {
            return null;
        }

        // excanvas and hence IE < 9 do not support toDataURL and cannot export images.
        if (!$.jqplot.support_canvas) {
            return null;
        }
        
        var newCanvas = document.createElement("canvas");
        var h = $(this).outerHeight(true);
        var w = $(this).outerWidth(true);
        var plotleft = $(this).offset().left;
        var plottop = $(this).offset().top;
        var transx = 0, transy = 0;
        // var tlw = tlh = tll = tlr = tlt = tlb = 0;
        // console.log("chart: height: %s, width: %s, left: %s, top: %s, transx: %s, transy: %s", h, w, plotleft, plottop, transx, transy);

        // have to check if any elements are hanging outside of plot area before rendering,
        // since changing width of canvas will erase canvas.

        var clses = ['jqplot-table-legend', 'jqplot-xaxis-tick', 'jqplot-x2axis-tick', 'jqplot-yaxis-tick', 'jqplot-y2axis-tick', 'jqplot-y3axis-tick', 
        'jqplot-y4axis-tick', 'jqplot-y5axis-tick', 'jqplot-y6axis-tick', 'jqplot-y7axis-tick', 'jqplot-y8axis-tick', 'jqplot-y9axis-tick',
        'jqplot-xaxis-label', 'jqplot-x2axis-label', 'jqplot-yaxis-label', 'jqplot-y2axis-label', 'jqplot-y3axis-label', 'jqplot-y4axis-label', 
        'jqplot-y5axis-label', 'jqplot-y6axis-label', 'jqplot-y7axis-label', 'jqplot-y8axis-label', 'jqplot-y9axis-label' ];

        var temptop, templeft, tempbottom, tempright;

        for (i in clses) {
            $(this).find('.'+clses[i]).each(function() {
                temptop = $(this).offset().top - plottop;
                templeft = $(this).offset().left - plotleft;
                tempright = templeft + $(this).outerWidth(true) + transx;
                tempbottom = temptop + $(this).outerHeight(true) + transy;
                if (templeft < -transx) {
                    w = w - transx - templeft;
                    transx = -templeft;
                }
                if (temptop < -transy) {
                    h = h - transy - temptop;
                    transy = - temptop;
                }
                if (tempright > w) {
                    w = tempright;
                }
                if (tempbottom > h) {
                    h =  tempbottom;
                }
                // console.log(this.tagName);
                // console.log(temptop, templeft, tempright, tempbottom);
                // console.log(w, h, transx, transy);
            })
        }
        // console.log("chart: height: %s, width: %s, left: %s, top: %s, transx: %s, transy: %s", h, w, plotleft, plottop, transx, transy);

        newCanvas.width = w + Number(x_offset);
        newCanvas.height = h + Number(y_offset);

        var newContext = newCanvas.getContext("2d"); 
        newContext.translate(transx, transy);
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
                        left += (newCanvas.width - newContext.measureText(text).width)/2  - transx;
                    }
                    newContext.fillText(text, left, top);
                }
            }

            // handle the standard table legend

            else if (tagname === 'table' && $(el).hasClass('jqplot-table-legend')) {
                newContext.strokeStyle = $(el).css('border-top-color');
                newContext.fillStyle = $(el).css('background-color');
                newContext.fillRect(left, top, $(el).innerWidth(), $(el).innerHeight());
                if (parseInt($(el).css('border-top-width')) > 0) {
                    newContext.strokeRect(left, top, $(el).innerWidth(), $(el).innerHeight());
                }



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
                    var l = left + elem.position().left;
                    var t = top + elem.position().top + parseInt(elem.css('padding-top'));
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
