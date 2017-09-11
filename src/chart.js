import React, { Component } from 'react';
import { raw } from './models/';

export default class Chart extends Component {
  /**
   * data should be:
   * [
   *  ['device', 'platform', 'pv', 'uv'],
   *  ['iphone', 'iOS',      200,  100 ],
   *  ['SamSum', 'android',  200,  100 ]
   * ]
   */
  render() {
    const { data = [] } = this.props;
    const config = this.props.config || {};
    const { chart = '', name = '', height } = config;
    const cnf = {
      className: `cube-canvas cube-${chart.toLowerCase().replace(' ', '-')}`,
      style: { height }
    };
    const definedChart = raw.charts.get(chart);
    if (definedChart) {
      const { category } = definedChart;
      if (category() === 'JSX') {
        cnf.children = definedChart(null, data, config);
      } else {
        cnf.ref = canvas => definedChart(canvas, data, config);
      }
    } else {
      cnf.children = 'not support';
    }
    return <div {...cnf} />;
  }
}
