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
