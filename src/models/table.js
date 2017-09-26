/**
 * @description 表格模型
 */
import { raw } from '../raw';
import { METRIC, DIMENSION, THOUSANDS, charts, style, formatStyle, formatNumber } from '../constants';

const { TABLE } = charts;

/**
 * columns: 
 * [
 *  {
 *    data: key,
 *    title:
 *    style: {}
 *  }
 * ]
 * data:
 * [
 *  [
 *    v, { value: v, style: {} }
 *  ]
 * ]
 */
raw.models.set(TABLE, () => {
  const model = raw.model();

  // 字段 segment
  const dimension = model.dimension('segment')
    .types(METRIC, DIMENSION)
    .items([
      { key: 'alias' },
      { key: 'width', label: 'width' },
    ])
    .required(2)
    .multiple(true)
    .style(style(TABLE))
    .format(THOUSANDS);

  model.map((d) => {
    const { value } = dimension;
    const metrics = value.filter(({ type }) => type === METRIC);
    const { data = [] } = d;
    const columns = value.map((o) => {
      const { style: s, format = '', items = [], key, label = key, name, alias } = o;
      const width = items.find(({ key: k }) => (k === 'width'));
      const newObj = {
        data: key,
        title: String(alias || name || label),
        render: (v) => {
          const { color } = s ? formatStyle(v, s) : {};
          const fv = format && format.length ? formatNumber(v, format) : v;
          return color ? { style: { color }, value: fv } : fv;
        },
      };
      if (width && width.value) newObj.style = { width };
      return newObj;
    });
    let newData = data;
    // 只有一个指标，归并
    if (metrics.length === 1) {
      newData = [];
      const metricIndex = value.indexOf(metrics[0]);
      const metricRowIndex = metrics[0].key;
      const MP = {};
      data.forEach((row) => {
        const dKey = dimension(row)
          .filter((v, index) => index !== metricIndex)
          .join('@_@');
        if (dKey in MP) {
          MP[dKey][metricRowIndex] = (Number(MP[dKey][metricRowIndex]) || 0) + (Number(row[metricRowIndex]) || 0);
        } else {
          MP[dKey] = row;
          newData.push(row);
        }
      });
    }
    return {
      columns,
      data: newData.map(row => row.map((cell, index) => (columns[index] ? columns[index].render(cell) : cell)))
    };
  });

  return model;
});
