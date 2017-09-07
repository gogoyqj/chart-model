/**
 * @description 饼图模型
 */
import { raw } from '../raw';
import { METRIC, DIMENSION, charts } from '../constants';

const { PIE } = charts;

// 数据层抽象
raw.models.set(PIE, () => {
  const model = raw.model();

  // 饼图: 可配置一个维度，一个指标，如选择按照维度画图，则以配置的维度为绘制维度，以配置的唯一指标确定饼图 arc 大小
  const dimension = model
    .dimension('dimension')
    .types(DIMENSION);

  // 饼图: 可以配置多个指标，则绘制 arc = Mn/(M1 + ... + MN) * Math.PI * 2 的饼图
  const arc = model
    .dimension('arc')
    .types(METRIC)
    .accessor((v, series, index) => {
      if (series === undefined) {
        return v;
      }
      series[index].value += Number(v);
    })
    .required(1)
    .multiple(true);

  /**
   * Input array:
   * Device Platform Page1 Page2 Page3
   * iPhone iOS      100   98    90
   * SamSum Android  500   298   20
   * Huawei Android  600   298   40
   * Output:
   *   Device: Page1:
   *   iPhone: 100
   *   SamSum: 500
   *   Huawei: 600
   * or:
   *    Page1: xxx
   *    Page2: xxx
   *    Page3: xxx
   */
  model.map((obj) => {
    const { data = [], meta = [] } = obj;
    const drawByDimension = dimension.value;
    const arcs = arc.value;
    const newData = [];
    const mp = {};
    // 按照维度绘制
    if (drawByDimension.length) {
      data.forEach((d) => {
        const dimensionKey = dimension(d);
        mp[dimensionKey] = (mp[dimensionKey] || 0) + arc(d)[0];
      });
      Object.keys(mp).forEach(name => newData.push({
        name,
        value: mp[name],
      }));
    } else {
      arcs.forEach(({ name }) => newData.push({
        name,
        value: 0
      }));
      data.forEach(d => arc(d, newData));
    }
    return newData;
  });

  return model;
});
