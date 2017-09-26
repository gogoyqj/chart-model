/**
 * @description 条形图图模型
 */
import { raw } from '../raw';
import { charts } from '../constants';

require('./line');

const { BAR, LINE } = charts;
raw.models.set(BAR, (config) => {
  const lineModel = raw.models.get(LINE);
  const model = lineModel(config);
  const lineMap = model.map();
  model.dimensions().get('XAxis')
    .required([1, 2])
    .multiple(true);
  model.config({
    style: ['stack', 'horizontal', 'hideXY']
  });
  const style = (config && config.style) || [];
  const stack = style.indexOf('stack') !== -1; // 堆叠
  const horizontal = style.indexOf('horizontal') !== -1; // 水平
  model.map((data) => {
    const lineLikeData = lineMap.call(this, data);
    if (horizontal) {
      // 交换 x & y
      const { xAxis, series } = lineLikeData;
      return {
        yAxis: xAxis,
        series,
      };
    }
    return lineLikeData;
  });
  return model;
});
