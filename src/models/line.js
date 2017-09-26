/**
 * @description 折线图模型
 */
import { raw } from '../raw';
import { i18n } from '../i18n';
import { PERCENTILE, TWO_DECIMAL, THOUSANDS, METRIC, DIMENSION, charts } from '../constants';

const { LINE } = charts;

raw.models.set(LINE, (config = {}) => {
  const model = raw.model();

  model.config({
    style: ['area', 'stack', 'hideXY']
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
    const style = (config && config.style) || [];
    const area = style.indexOf('area') !== -1; // 堆叠
    const stack = style.indexOf('stack') !== -1; // 堆叠
    const hideXY = style.indexOf('hideXY') !== -1; // 隐藏 x y 坐标
    const { data = [] } = obj;
    const xAxis = [];
    const series = [];
    const X = XAxis.value;
    const onlyOneXDimension = X.length < 2;
    // 一个 X 轴，则将所有指标堆叠在一起
    // 两个 X 轴，则按照第二个 X 轴的值，进行堆叠
    if (onlyOneXDimension) {
      YAxis.value.forEach(({ name }) => {
        series.push({
          name,
          area,
          stack: stack ? '总量' : false,
          value: []
        });
      });
      data.forEach((d) => {
        let x = XAxis(d);
        if (Array.isArray(x)) x = x[0];
        if (xAxis.indexOf(x) === -1) xAxis.push(x);
        YAxis(d, series);
      });
    } else {
      const seriesMP = {};
      const metricMP = {};
      model
        .dimensions()
        .get('YAxis')
        .accessor(v => v);
      data.forEach((d) => {
        const arr = XAxis(d);
        const x = arr[0];
        const y = YAxis(d, series);
        let pos = xAxis.indexOf(x);
        if (pos === -1) {
          pos = xAxis.length;
          xAxis.push(x);
        }
        YAxis.value.forEach(({ name }, index) => {
          const seriesMPKey = `${arr[1]}${name}`;
          if (!(seriesMPKey in seriesMP)) {
            const stackName = stack ? name : false;
            seriesMP[seriesMPKey] = {
              name: seriesMPKey,
              area,
              stack: stackName,
              value: [],
            };
            metricMP[stackName] = metricMP[stackName] || [];
            metricMP[stackName].push(seriesMP[seriesMPKey]);
          }
          // 此处不能 push, 数据不一定连续
          seriesMP[seriesMPKey].value[pos] = y[index];
        });
      });
      // 有序
      Object
        .keys(metricMP)
        .forEach((key) => {
          series.push(...metricMP[key]);
        });
    }
    return {
      hideXY,
      xAxis,
      series
    };
  });
  return model;
});
