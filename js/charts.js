// data for traction chart
var randomScalingFactor = function(){ return Math.round(Math.random()*500000)};
var lineChartData = {
    labels : ["May","June","July","August","September","October","November"],
    datasets : [
        {
            label: "My First dataset",
            fillColor : "rgba(220,220,220,0.2)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : [randomScalingFactor()*0.3,randomScalingFactor()*0.5,randomScalingFactor()*0.8,randomScalingFactor()*1.2,randomScalingFactor()*1.5,randomScalingFactor()*1.8,randomScalingFactor()*2]
        }
    ]
}

// draw traction chart
window.onload = function(){
    var ctx = document.getElementById("traction_chart").getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData, {
        responsive: true
    });
}
