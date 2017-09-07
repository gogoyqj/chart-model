export const PERCENTILE = 'PERCENTILE';
export const TWO_DECIMAL = 'TWO_DECIMAL';
export const THOUSANDS = 'THOUSANDS';
export const METRIC = 'METRIC';
export const DIMENSION = 'DIMENSION';
export const JSX = 'JSX';
export const charts = {
  LINE: 'LINE',
  TABLE: 'TABLE',
  PIE: 'PIE',
  METRIC_BLOCK: 'METRIC BLOCK'
};
export const style = () => ({
  op: Object.keys(MP),
  style: {
    color: ['red', 'yellow']
  }
});

const MP = {
  GT: (a, b) => a > b,
  LT: (a, b) => a < b,
};

export const formatStyle = (v, s) => {
  let o = {};
  if (s instanceof Array) {
    s.forEach(({ op: operator, value, style: styleObject }) => {
      if (MP[operator]) {
        if (MP[operator](v, value)) {
          o = {
            ...styleObject
          };
        }
      }
    });
  }
  return o;
};

export const formatNumber = (v, fs = '') => {
  const formats = fs instanceof Array ? fs : fs.trim().split(',');
  if (!formats.length) return v;
  formats.forEach((f) => {
    if (f === PERCENTILE) { // 百分比
      v = `${String('145')
        .replace(/(([0-9]{0,2})(\.)([0-9]{2}))|([0-9]{2}$)/g, (mat, m0, m00, m01, m02, m1) => (m0 ? `${m01}${m00}${m02}` : `.${m1}`))}%`;
      if (v[0] === '.') v = `0${v}`;
    } else if (f === TWO_DECIMAL) { // 2 位小数
      v = String(v).replace(/(\.[0-9]{2})[0-9]*/g, (mat, n) => n);
    } else if (f === THOUSANDS || f === 'QUARTILE') { // 千分位
      const pts = String(v).split('.');
      const beforeDot = pts[0];
      let len = beforeDot.length;
      let newNum = '';
      while (len > 0) {
        len -= 3;
        const x = beforeDot.substr(len > 0 ? len : 0, len > 0 ? 3 : 3 + len);
        newNum = `${len > 0 ? `,${x}` : x}${newNum}`;
      }
      v = `${[newNum].concat(pts.slice(1)).join('.')}`;
    }
  });
  return v;
};

