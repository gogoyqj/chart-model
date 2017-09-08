/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { i18n } from '../i18n';
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
      series[index].value.push(v);
    })
    .required(1)
    .multiple(true);

  // 格式化数据
  model.map((obj) => {
    const { data = [], meta = [] } = obj;
    const xAxis = [];
    const series = [];
    YAxis.value.forEach(({ name }) => {
      series.push({
        name,
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
