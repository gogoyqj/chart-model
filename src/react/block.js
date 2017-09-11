/**
 * @description 指标块模型
 */
import React, { Component } from 'react';
import { raw } from '../raw';
import { JSX, charts } from '../constants';

const { METRIC_BLOCK } = charts;

raw
  .chart(METRIC_BLOCK)
  .category(JSX)
  .draw((canvas, metrics = []) => {
    const width = Math.floor(12 / metrics.length);
    return (
      <div className="metric-list row">
        {
          metrics.map(({ title, value, style = {} }, index) => {
            const k = `b${index}`;
            return (
              <div className={`col-xs-${width} pricing-box`} key={k}>
                <div className="widget-box widget-color-blue">
                  <div className="widget-header">
                    <h5 className="widget-title bigger lighter">{title}</h5>
                  </div>
                  <div className="widget-main">
                    <div className="price" style={style}>
                      {value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  });
