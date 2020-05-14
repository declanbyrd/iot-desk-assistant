"use strict";

const temperature = document.getElementById("tempValue");
const humidity = document.getElementById("humiValue");
const lightLevel = document.getElementById("lightValue");
const motion = document.getElementById("motionValue");

const temperatureChart = document.getElementById("tempContainer");
const humidityChart = document.getElementById("humiContainer");
const lightLevelChart = document.getElementById("lightContainer");
const motionChart = document.getElementById("motionContainer");

const tempData = [];
const humiData = [];
const lightData = [];
const motionData = [];

const topics = [
  "data/temperature",
  "data/humidity",
  "data/light-levels",
  "data/motion",
];

const client = new Paho.MQTT.Client("157.245.42.9", 9001, "Web Application");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect: Connected to broker");
  topics.forEach((topic) => {
    client.subscribe(topic);
    console.log("Subscribed to " + topic);
  });
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  const time = new Date().getTime();
  switch (message.destinationName) {
    case "data/temperature":
      temperature.textContent = `${message.payloadString} °C`;
      if (tempData.length == 29) tempData.shift();
      tempData.push({
        time: time,
        value: message.payloadString,
      });
      chartTemp.series[0].addPoint(
        [time, parseInt(message.payloadString)],
        true,
        true
      );
      break;
    case "data/humidity":
      humidity.textContent = `${message.payloadString} RH`;
      if (humiData.length == 29) humiData.shift();
      humiData.push({
        time: time,
        value: message.payloadString,
      });
      chartHumid.series[0].addPoint(
        [time, parseInt(message.payloadString)],
        true,
        true
      );
      break;
    case "data/light-levels":
      lightLevel.textContent = message.payloadString;
      if (lightData.length == 29) lightData.shift();
      lightData.push({
        time: time,
        value: message.payloadString,
      });
      chartLight.series[0].addPoint(
        [time, parseInt(message.payloadString)],
        true,
        true
      );
      break;
    case "data/motion":
      const value = message.payloadString > 0 ? "True" : "False";
      motion.textContent = value;
      if (motionData.length == 29) motionData.shift();
      motionData.push({
        time: time,
        value: message.payloadString,
      });
      chartMotion.series[0].addPoint(
        [time, parseInt(message.payloadString)],
        true,
        true
      );
      break;
    default:
      break;
  }
}

const chartTemp = Highcharts.chart(temperatureChart, {
  chart: {
    type: "spline",
    animation: Highcharts.svg, // don't animate in old IE
    maxWidth: "100%",
  },

  time: {
    useUTC: false,
  },

  title: {
    text: "Temperature Data",
  },

  accessibility: {
    announceNewData: {
      enabled: true,
      minAnnounceInterval: 15000,
      announcementFormatter: function (allSeries, newSeries, newPoint) {
        if (newPoint) {
          return "New point added. Value: " + newPoint.y;
        }
        return false;
      },
    },
  },

  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
  },

  yAxis: {
    title: {
      text: "Temperature (°C)",
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: "#808080",
      },
    ],
  },

  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
  },

  legend: {
    enabled: false,
  },

  exporting: {
    enabled: false,
  },

  series: [
    {
      name: "Temperature data",
      data: (function () {
        // generate an array of random data
        const data = [];
        const time = new Date().getTime();

        for (let i = -59; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0,
          });
        }
        return data;
      })(),
    },
  ],
});

const chartHumid = Highcharts.chart(humidityChart, {
  chart: {
    type: "spline",
    animation: Highcharts.svg, // don't animate in old IE
    marginRight: 10,
  },

  time: {
    useUTC: false,
  },

  title: {
    text: "Humidity Data",
  },

  accessibility: {
    announceNewData: {
      enabled: true,
      minAnnounceInterval: 15000,
      announcementFormatter: function (allSeries, newSeries, newPoint) {
        if (newPoint) {
          return "New point added. Value: " + newPoint.y;
        }
        return false;
      },
    },
  },

  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
  },

  yAxis: {
    title: {
      text: "Humidity (RH)",
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: "#808080",
      },
    ],
  },

  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
  },

  legend: {
    enabled: false,
  },

  exporting: {
    enabled: false,
  },

  series: [
    {
      name: "Humidity data",
      data: (function () {
        // generate an array of random data
        const data = [];
        const time = new Date().getTime();

        for (let i = -59; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0,
          });
        }
        return data;
      })(),
    },
  ],
});

const chartLight = Highcharts.chart(lightLevelChart, {
  chart: {
    type: "spline",
    animation: Highcharts.svg, // don't animate in old IE
    marginRight: 10,
  },

  time: {
    useUTC: false,
  },

  title: {
    text: "Light Level Data",
  },

  accessibility: {
    announceNewData: {
      enabled: true,
      minAnnounceInterval: 15000,
      announcementFormatter: function (allSeries, newSeries, newPoint) {
        if (newPoint) {
          return "New point added. Value: " + newPoint.y;
        }
        return false;
      },
    },
  },

  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
  },

  yAxis: {
    title: {
      text: "Light Level",
    },

    plotLines: [
      {
        value: 0,
        width: 1,
        color: "#808080",
      },
    ],
  },

  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
  },

  legend: {
    enabled: false,
  },

  exporting: {
    enabled: false,
  },

  series: [
    {
      name: "Light Level data",
      data: (function () {
        // generate an array of random data
        const data = [];
        const time = new Date().getTime();

        for (let i = -59; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0,
          });
        }
        return data;
      })(),
    },
  ],
});

const chartMotion = Highcharts.chart(motionChart, {
  chart: {
    type: "spline",
    animation: Highcharts.svg, // don't animate in old IE
    marginRight: 10,
  },

  time: {
    useUTC: false,
  },

  title: {
    text: "Motion Data",
  },

  accessibility: {
    announceNewData: {
      enabled: true,
      minAnnounceInterval: 15000,
      announcementFormatter: function (allSeries, newSeries, newPoint) {
        if (newPoint) {
          return "New point added. Value: " + newPoint.y;
        }
        return false;
      },
    },
  },

  xAxis: {
    type: "datetime",
    tickPixelInterval: 150,
  },

  yAxis: {
    title: {
      text: "Value",
    },
    max: 1,
    min: 0,
    plotLines: [
      {
        value: 0,
        width: 1,
        color: "#808080",
      },
    ],
  },

  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}",
  },

  legend: {
    enabled: false,
  },

  exporting: {
    enabled: false,
  },

  series: [
    {
      name: "Motion data",
      data: (function () {
        // generate an array of random data
        const data = [];
        const time = new Date().getTime();

        for (let i = -59; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: 0,
          });
        }
        return data;
      })(),
    },
  ],
});
