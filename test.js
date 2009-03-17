$(document).ready(function(){
    h0 = $("#chartdiv").css('height');
    h2 = $("#chartdiv").outerHeight();
    h3 = $("#chartdiv").outerHeight(true);
    h1 = $("#chartdiv").innerHeight();
    $("#output").html("css('height') is:" +h0+"<br>innerHeight() is: "+h1+"<br>outerHeight() is: "+h2+"<br>outerHeight(true) is: "+h3);
    h0 = $("#t2").css('height');
    h2 = $("#t2").outerHeight();
    h3 = $("#t2").outerHeight(true);
    h1 = $("#t2").innerHeight();
    $("#out2").html("css('height') is:" +h0+"<br>innerHeight() is: "+h1+"<br>outerHeight() is: "+h2+"<br>outerHeight(true) is: "+h3);
});