### 图表

##### 定义 model

```jsx
/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { i18n } from '../../i18n';
import { PERCENTILE, TWO_DECIMAL, THOUSANDS, METRIC, DIMENSION, charts } from '../constants';

const { LINE } = charts;

raw.models.set(LINE, () => {
  const model = raw.model();

  // 定义 x 轴，维度：比如 日期
  const XAxis = model.dimension('XAxis')
    .types(DIMENSION)
    .required(1);

  // 定义 y 轴，指标：比如 PV
  const YAxis = model.dimension('YAxis')
    .label(`YAxis ${i18n(METRIC)}`)
    .types(METRIC)
    // .style(style(LINE))
    .format(PERCENTILE, TWO_DECIMAL, THOUSANDS)
    .accessor((v, series, index) => {
      series[index].push(v);
    })
    .required(1)
    .multiple(true);

  // 格式化数据
  model.map((obj) => {
    const { data = [], meta = [] } = obj;
    const xAxis = [];
    const series = [];
    YAxis.value.forEach(() => {
      series.push([]);
    });
    data.forEach((d) => {
      const x = XAxis(d);
      if (xAxis.indexOf(x) === -1) xAxis.push(x);
      YAxis(d, series);
    });
    return {
      xAxis,
      series
    };
  });
  return model;
});

```

##### 定义 chart

```jsx
/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { charts } from '../constants';
import { init } from './init';

const { LINE } = charts;

raw
  .chart(LINE)
  .draw((canvas, { xAxis, series }, config) => {
    if (canvas) {
      const { name } = config;
      const option = {
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        ...config,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series.map(data => ({
          name,
          type: LINE.toLowerCase(),
          stack: '总量',
          areaStyle: { normal: {} },
          data
        })),
      };
      init(canvas).setOption(option);
    }
  });
```

##### 使用 react chart

```jsx
  import React from 'react';
  import Chart from './chart';

  const config = {
    "chart": "LINE",
    "dimension": {
      "XAxis": [
        {
          "id": "23",
          "name": "date"
        }
      ],
      "YAxis": [
        {
          "id": "18",
          "name": "pv"
        },
        {
          "id": "19",
          "name": "uv"
        }
      ]
    }
  }
  const data = [
    ["pv", "uv", "platform", "date"],
    [
      7036,
      422,
      "iOS",
      "2017-08-01"
    ],
    [
      1032,
      54,
      "Android",
      "2017-08-01"
    ],
    [
      7489,
      533,
      "iOS",
      "2017-08-02"
    ],
    [
      2621,
      547,
      "Android",
      "2017-08-02"
    ],
    [
      8434,
      143,
      "iOS",
      "2017-08-03"
    ],
    [
      1043,
      69,
      "Android",
      "2017-08-03"
    ],
    [
      6725,
      604,
      "iOS",
      "2017-08-04"
    ],
    [
      3216,
      141,
      "Android",
      "2017-08-04"
    ],
    [
      7516,
      761,
      "iOS",
      "2017-08-05"
    ],
    [
      6067,
      216,
      "Android",
      "2017-08-05"
    ],
    [
      7358,
      61,
      "iOS",
      "2017-08-06"
    ],
    [
      3511,
      569,
      "Android",
      "2017-08-06"
    ],
    [
      7587,
      479,
      "iOS",
      "2017-08-07"
    ],
    [
      2935,
      616,
      "Android",
      "2017-08-07"
    ],
    [
      1344,
      142,
      "iOS",
      "2017-08-08"
    ],
    [
      7054,
      420,
      "Android",
      "2017-08-08"
    ],
    [
      4469,
      931,
      "iOS",
      "2017-08-09"
    ],
    [
      4196,
      999,
      "Android",
      "2017-08-09"
    ]
  ];
  const render = () => (<Chart config={config} data={data} />);
```