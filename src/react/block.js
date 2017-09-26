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
  .draw((canvas, ms = []) => {
    const metrics = [];
    const mp = {};
    ms.forEach((metric) => {
      const { $dimension: { $specialId: id }, title, value, style } = metric;
      if (id !== undefined) {
        if (!(id in mp)) {
          mp[id] = metrics.length;
          metrics.push({
            ...metric,
            values: []
          });
        }
        metrics[mp[id]].values.push({
          title,
          value,
          style
        });
      } else {
        metric.values = [metric];
        metrics.push(metric);
      }
    });
    const width = Math.floor(12 / metrics.length);
    return (
      <div className="metric-list row">
        {
          metrics.map(({ title, values }, index) => {
            const k = `b${index}`;
            return (
              <div className={`col-xs-${width} pricing-box`} key={k}>
                <div className="widget-box widget-color-blue">
                  <div className="widget-header">
                    <h5 className="widget-title bigger lighter">{title}</h5>
                  </div>
                  <div className="widget-main">
                    {
                      values.map(({ title: t, value, style }) => (
                        <div className="price" key={t}>
                          {t.replace(title, '')} <span style={style}>{value}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  });
