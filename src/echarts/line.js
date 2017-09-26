/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { charts } from '../constants';
import { init } from './init';

const { LINE, BAR } = charts;

const DRAW = (canvas, { xAxis, yAxis, series, hideXY = false }, config = {}, ModelName = LINE) => {
  const xy = {
    xAxis: [
      {
        type: 'category',
        show: !hideXY,
        boundaryGap: ModelName !== LINE,
        data: xAxis || yAxis,
      }
    ],
    yAxis: [
      {
        show: !hideXY,
        type: 'value'
      }
    ],
  };
  if (yAxis !== undefined) { // 水平
    const x = xy.xAxis;
    xy.xAxis = xy.yAxis;
    xy.yAxis = x;
  }
  if (canvas) {
    const { name, } = config;
    const option = {
      title: {
        text: name
      },
      legend: {
        data: series.map(({ name: category }) => category),
      },
      grid: {
        left: '0',
        right: '0%',
        bottom: '0',
        containLabel: true
      },
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
      ...xy,
      series: series.map((item) => {
        const { name: seriesName, value, area, stack } = item;
        const s = {
          stack,
          name: seriesName,
          data: value,
          type: ModelName.toLowerCase(),
          barMaxWidth: 60,
        };
        if (area) s.areaStyle = { normal: {} }; // 面积
        return s;
      }),
    };
    init(canvas).setOption(option);
  }
};

raw
  .chart(LINE)
  .draw(DRAW);

raw
  .chart(BAR)
  .draw((canvas, data, config) => {
    return DRAW(canvas, data, config, BAR);
  });
