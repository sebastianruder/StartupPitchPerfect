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

// data for problem chart
var pieData = [
    {
        value: 300,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Red",
        title: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green",
        title: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow",
        title: "Yellow"
    },
    {
        value: 40,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "Grey",
        title: "Grey"
    },
    {
        value: 120,
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey",
        title: "Dark Grey"
    }
];

// stats bar

  var mydata1 = [
    {
  		value : 30,
  		color: "#D97041",
      title : "users"
  	},
  	{
  		value : 90,
  		color: "#C7604C",
      title : "non-users"
  	},
  	{
  		value : 24,
  		color: "#21323D",
      title : "have tried but not used yet"
  	},
  	{
  		value : 58,
  		color: "#9D9B7F",
      title : "maybes"
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


var varcrosstxt = {
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
};

// draw charts
window.onload = function() {
    var traction_chart = document.getElementById("traction_chart").getContext("2d");
    window.myLine = new Chart(traction_chart).Line(lineChartData, {
        responsive: true
    });
    /*
    var problem_chart = document.getElementById("problem_chart").getContext("2d");
    stats(mydata1, varcrosstxt);
    */
    // window.myPie = new Chart(problem_chart).Pie(pieData);
    var myBar = new Chart(document.getElementById("new_chart").getContext("2d")).Pie(mydata1, varcrosstxt);
}
