var echart = echarts.init(document.getElementById("echart"))

const refreshChart = (data) => {
    var option = {
        title: {
            text: "Gesture Recognition"
        },
        tooltip: {},
        legend: { data: ["Confidence"] },
        xAxis: { data: ["No Gesture", "Do", "Re", "Mi", "Fa", "So"] },
        yAxis: {},
        series: [
            {
                name: "Confidence",
                type: "line",
                data: data
            }
        ]
    }
    echart.setOption(option);
}

export { refreshChart };


