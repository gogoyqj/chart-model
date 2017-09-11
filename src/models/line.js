/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { i18n } from '../i18n';
import { PERCENTILE, TWO_DECIMAL, THOUSANDS, METRIC, DIMENSION, charts } from '../constants';

const { LINE } = charts;

raw.models.set(LINE, (config) => {
  const model = raw.model();

  model.config({
    style: ['area', 'stack']
  });

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
      series[index].value.push(v);
    })
    .required(1)
    .multiple(true);

  // 格式化数据
  model.map((obj) => {
    const style = config.config && config.config.style || [];
    const area = style.indexOf('area') !== -1; // 堆叠
    const stack = style.indexOf('stack') !== -1; // 堆叠
    const { data = [], meta = [] } = obj;
    const xAxis = [];
    const series = [];
    YAxis.value.forEach(({ name }) => {
      series.push({
        name,
        area,
        stack: stack ? '总量' : false, // 折线的堆叠，都在一起
        value: []
      });
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
