import React from "react";
import { render } from 'react-dom';
import "./src/charts/";
import Chart from "./src/charts/chart";
import './demo.less';

const configLINE = {
  chart: "LINE",
  dimension: {
    XAxis: [
      {
        id: "23",
        name: "date"
      }
    ],
    YAxis: [
      {
        id: "18",
        name: "pv"
      },
      {
        id: "19",
        name: "uv"
      }
    ]
  }
};
const configPIE = {
  chart: "PIE",
  dimension: {
    dimension: [
      {
        id: "23",
        name: "platform"
      }
    ],
    arc: [
      {
        id: "19",
        name: "uv"
      }
    ]
  }
};
const configBLOCK = {
  chart: "METRIC BLOCK",
  dimension: {
    metric: [
        {
          id: "19",
          name: "pv"
        },
        {
          id: "20",
          name: "uv"
        }
    ]
  }
};
const data = [
  ["pv", "uv", "platform", "date"],
  [7036, 422, "iOS", "2017-08-01"],
  [1032, 54, "Android", "2017-08-01"],
  [7489, 533, "iOS", "2017-08-02"],
  [2621, 547, "Android", "2017-08-02"],
  [8434, 143, "iOS", "2017-08-03"],
  [1043, 69, "Android", "2017-08-03"],
  [6725, 604, "iOS", "2017-08-04"],
  [3216, 141, "Android", "2017-08-04"],
  [7516, 761, "iOS", "2017-08-05"],
  [6067, 216, "Android", "2017-08-05"],
  [7358, 61, "iOS", "2017-08-06"],
  [3511, 569, "Android", "2017-08-06"],
  [7587, 479, "iOS", "2017-08-07"],
  [2935, 616, "Android", "2017-08-07"],
  [1344, 142, "iOS", "2017-08-08"],
  [7054, 420, "Android", "2017-08-08"],
  [4469, 931, "iOS", "2017-08-09"],
  [4196, 999, "Android", "2017-08-09"]
];

export default class Demo extends React.Component {
  render() {
    return (
      <div>
        <Chart config={configLINE} data={data} />
        <Chart config={configPIE} data={data} />
        <Chart config={configBLOCK} data={data} />
      </div>
    );
  }
}


render(
    <Demo/>,
    document.querySelector('#app'));
