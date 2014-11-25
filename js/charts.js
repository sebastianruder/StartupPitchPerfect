// data for traction chart
var randomScalingFactor = function(){ return Math.round(Math.random()*500000)};
var tractionChartData = {
    labels : ["May","June","July","August","September","October","November"],
    datasets : [
        {
            label: "My First dataset",
            labels: ["one", "two", "three", "four", "five", "six", "seven"],
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

// data for problem chart
var problemChartData = [
{
    value : randomScalingFactor()*2,
    color: "#D97041",
  title : "would sell their left kidney for it"
},
{
    value : randomScalingFactor()*1.5,
    color: "#C7604C",
  title : "need it a lot"
},
{
    value : randomScalingFactor(),
    color: "#21323D",
  title : "would maybe buy it"
},
{
    value : randomScalingFactor(),
    color: "#9D9B7F",
  title : "are indifferent"
},
/*
{
    value : 82,
    color: "#7D4F6D",
  title : "data5"
},
{
    value : 8,
    color: "#584A5E",
  title : "data6"
}
*/
];

// draw charts
window.onload = function() {
    var traction_chart = document.getElementById("traction_chart").getContext("2d");
    window.myLine = new Chart(traction_chart).Line(tractionChartData, {
        responsive: true,
        // inGraphDataShow : true,
        inGraphDataFontColor: "#FFF",
        scaleFontColor: "#FFF"
    });
    var problem_chart = new Chart(document.getElementById("problem_chart").getContext("2d")).Pie(problemChartData, {
        /*
        inGraphDataShow: true,
        inGraphDataFontColor: "#FFF",
        inGraphDataFontSize: 15,
        // radiusScale: 1.3,
        inGraphDataAlign: "to-center",
        inGraphDataVAlign: "to-center",
        inGraphDataRotate: "inRadiusAxisRotateLabels", // "inRadiusAxisRotateLabels"
        */
        legend : true,
        legendFontSize: 20,
        legendFontStyle: "normal",
        legendFontColor: "#FFF",
        legendBlockSize: 15,
        legendBorders: false,
        legendBordersWidth: 1
    });
}
