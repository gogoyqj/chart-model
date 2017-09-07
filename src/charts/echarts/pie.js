/**
 * @description 饼图模型
 */
import { raw } from '../raw';
import { charts } from '../constants';
import { init } from './init';

const { PIE } = charts;

// 数据 => 具体图表库抽象
raw.chart(PIE)
  .draw((canvas, data, config) => {
    if (canvas) {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        ...config,
        legend: {
          data: data.map(({ name }) => name),
        },
        series: [
          {
            name: '',
            type: PIE.toLowerCase(),
            data
          }
        ]
      };
      init(canvas).setOption(option);
    }
  });
