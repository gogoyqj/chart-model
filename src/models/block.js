/**
 * @description 指标块模型
 */
import { raw } from '../raw';
import { PERCENTILE, TWO_DECIMAL, THOUSANDS, METRIC, charts, style, formatStyle, formatNumber } from '../constants';

const { METRIC_BLOCK } = charts;

raw.models.set(METRIC_BLOCK, () => {
  const model = raw.model();
  model.config({
    compare: ['year on year', 'ring ratio']
  });

  // 定义一个指标块
  const Metric = model.dimension('metric')
    .types(METRIC)
    .items([
      { key: 'alias' }
    ])
    .format(PERCENTILE, TWO_DECIMAL, THOUSANDS)
    .style(style(METRIC_BLOCK))
    .accessor((v, metrics, index) => {
      metrics[index] = (metrics[index] || 0) + Number(v);
    })
    .required(1)
    .multiple(true);

  // 格式化数据
  model.map((obj) => {
    const { data = [], meta = [] } = obj;
    const metrics = [];
    const dimensions = Metric.value;
    data.forEach(d => Metric(d, metrics));
    // 格式化
    return metrics.map((v, index) => {
      const { style: s, format = '', key, name, showName, alias } = dimensions[index] || {};
      const styleObject = formatStyle(v, s) || {};
      const fv = formatNumber(v, format);
      return {
        $dimension: dimensions[index] || {},
        title: showName || alias || name || key,
        value: fv,
        style: styleObject
      };
    });
  });
  return model;
});
