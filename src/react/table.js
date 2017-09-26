/**
 * @description 表格模型
 */
import React from 'react';
import { raw } from '../raw';
import { charts, JSX } from '../constants';
import { Table } from '../../features/common/';

const { TABLE } = charts;


raw
  .chart(TABLE)
  .category(JSX)
  .draw((canvas, data, config) => {
    const conf = {
      ...config,
      config: {
        destroy: true,
        columns: data.columns.map(({ style, title, data: key }) => {
          const col = {
            title,
            data: key,
            render: (cell) => {
              if (cell.value !== undefined) {
                const { value, style: cellStyle = {} } = cell;
                const { color } = cellStyle;
                return color ? `<label style="color:${color};">${value}</label>` : value;
              }
              return cell;
            }
          };
          if (style && style.width) col.width = `${style.width}px`;
          return col;
        }),
        data: data.data
      }
    };
    return <Table {...conf} />;
  });

