/**
 * @component raw
 * @description 提供报表的抽象模型<br>
 * thanks to `https://raw.githubusercontent.com/densitydesign/raw/master/lib/raw.js`<br>
 * & d3.js
 */
import Map from 'd3-collection/src/map.js';
var raw = {
  version : "1.0.0",
  models : new Map(),
  charts : new Map()
};
const $d3 = {};

$d3.max = function(array, f) {
  var i = -1, n = array.length, a, b;
  if (arguments.length === 1) {
    while (++i < n && ((a = array[i]) == null || a != a)) a = undefined;
    while (++i < n) if ((b = array[i]) != null && b > a) a = b;
  } else {
    while (++i < n && ((a = f.call(array, array[i], i)) == null || a != a)) a = undefined;
    while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
  }
  return a;
}

$d3.entries = function(map) {
  var entries = [];
  for (var key in map) entries.push({
    key: key,
    value: map[key]
  });
  return entries;
}

$d3.sum = function(array, f) {
  var s = 0, n = array.length, a, i = -1;
  if (arguments.length === 1) {
    while (++i < n) if (!isNaN(a = +array[i])) s += a;
  } else {
    while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
  }
  return s;
}

$d3.nest = function() {
  function map(array, depth) {
    if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
    var i = -1, n = array.length, key = keys[depth++], keyValue, object, valuesByKey = new Map(), values, o = {};
    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
        values.push(object);
      } else {
        valuesByKey.set(keyValue, [ object ]);
      }
    }
    valuesByKey.forEach(function(keyValue, values) {
      o[keyValue] = map(values, depth);
    });
    return o;
  }
  function entries(map, depth) {
    if (depth >= keys.length) return map;
    var a = [], sortKey = sortKeys[depth++], key;
    for (key in map) {
      a.push({
        key: key,
        values: entries(map[key], depth)
      });
    }
    if (sortKey) a.sort(function(a, b) {
      return sortKey(a.key, b.key);
    });
    return a;
  }
  var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
  nest.map = function(array) {
    return map(array, 0);
  };
  nest.entries = function(array) {
    return entries(map(array, 0), 0);
  };
  nest.key = function(d) {
    keys.push(d);
    return nest;
  };
  nest.sortKeys = function(order) {
    sortKeys[keys.length - 1] = order;
    return nest;
  };
  nest.sortValues = function(order) {
    sortValues = order;
    return nest;
  };
  nest.rollup = function(f) {
    rollup = f;
    return nest;
  };
  return nest;
};

$d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

$d3.dispatch = function() {
  var dispatch = new d3_dispatch, i = -1, n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return arguments.length ? target : value;
  };
}

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."), name = "";
  if (i > 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }
  return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
};

function d3_dispatch_event(dispatch) {
  function event() {
    var z = listeners, i = -1, n = z.length, l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }
  var listeners = [], listenerByName = new Map();
  event.on = function(name, listener) {
    var l = listenerByName.get(name), i;
    if (arguments.length < 2) return l && l.on;
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }
    if (listener) listeners.push(listenerByName.set(name, {
      on: listener
    }));
    return dispatch;
  };
  return event;
}


/**
 * @description 根据 raw.models 获取已定义 chart 类型
 * @method getChartTypes
 */
export const getChartTypes = () => {
  const types = [];
  raw.models.each((v, type) => types.push(type));
  return types;
};

/**
 * @description 根据配置生产 model
 * @param {string} chart 图表类型
 * @param {object} config 配置信息
 */
export const createModel = (chart = 'LINE', config = {}) => {
  const modelFactory = raw.models.get(chart);
  if (modelFactory) {
    const model = modelFactory(config);
    model.dimensions().each((v, key) => {
      const { dimension = {} } = config;
      if (key in dimension) {
        dimension[key].forEach(item => v.add(item));
      }
    });
    return model;
  }
};

/**
 * @description 创建一个图表
 * @method raw.chart
 * @param {string} id 图表 id
 * @return chart
 */
raw.chart = function(id) {
  var id = id || raw.charts.values().length;
  var info = {
    draw: function() {
      return;
    },
    model: '',
    category: '',
  };

  var chart = function (canvas, data = [], config = {}) {
    const model = createModel(info.model || config.chart, config);
    const draw = config.draw || info.draw; // 如果带入了新的 draw 方法
    if (model) {
      return draw.call(this, canvas, model(data, config), config);
    } else {
      console.warn(`${config.chart} not defined`);
      return null;
    }
  }

  /**
   * @description 图表的绘制方法
   * @method chart.draw
   * @param {dom} canvas 画布节点
   * @param {array} data 格式化后的数据
   * @param {object} config 配置
   * @return chart.category === 'JSX' ? JSX : 实现在 canvas 画布上绘制销毁、报表的逻辑
   */
  /**
   * @description 获取/设置图表 model id，比如 chart 'PIE' && 'VUE.PIE' 实际可以基于同一个 model
   * @method chart.model
   * @param {string} 
   */
  Object.keys(info).forEach((method) => {
    chart[method] = function(m) {
      if (!arguments.length) {
        return info[method];
      }
      info[method] = m;
      return chart;
    }
  })

  raw.charts.set(id, chart);
  return chart;
}

/**
 * @description 创建一个空的模型
 * @method raw.model
 * @return 模型
 */
raw.model = function () {

  var dimensions = new Map();

  var model = function (rawData, config) {
    if (!rawData) return;
    const meta = rawData.meta || rawData[0];
    const data = rawData.meta ? rawData.data : rawData.slice(1);
    if (meta) {
      dimensions.each((dimension) => {
        dimension.value.forEach((dim) => {
          if (!('key' in dim)) {
            const key = meta.indexOf(dim.name);
            dim.key = key;
          }
        })
      })
    }
    return map.call(this, {
      meta,
      data
    }, config);
  }

  function map(data) {
    return data;
  }

  /**
   * @description 定义模型的 map 方法
   * @method model.map
   * @param {function} 数据格式化函数
   * @return model
   */
  model.map = function(_) {
    if (!arguments.length) return map;
    map = _;
    return model;
  }


  /**
   * @description 定义模型的维度
   * @method model.dimension
   * @param {string} 维度的唯一标识
   * @return 该维度
   */
  model.dimension = function(id) {
    var id = id || dimensions.values().length;
    var dimension = model_dimension(id ? { key: id } : {});
    dimensions.set(id, dimension);
    return dimension;
  }
  
  /**
   * @description 获取模型的所有已定义维度
   * @method model.dimensions
   * @return 维度 d3-collection map 实例
   */
  model.dimensions = function() {
    return dimensions;
  }

  /**
   * @description 校验模型各维度赋值是否满足 required 限制
   * @method model.isValid 
   * @return bool
   */
  model.isValid = function() {
    return dimensions.values()
      .filter(function(d){ 
        const required = d.required();
        const len = d.value.length;
        if (required instanceof Array) {
          return !(len >= required[0] && len <= required(1));
        }
        return required > len;
       })
      .length == 0;
  }

  /**
   * @description 清空模型各维度
   * @method model.clear
   * @return undefined
   */
  model.clear = function() {
    dimensions.values().forEach(function (d){ d.clear()});
  }

  var config = {};

  /**
   * @description 扩展其他配置
   * @method model.config
   */
  model.config = function(c) {
    if (arguments.length === 0) return config;
    config = {
      ...config,
      ...c
    };
    return model;
  }

  return model;

}


function model_dimension(o) {
  
  var dispatch = $d3.dispatch('change');
  var info = {
    key: 'Untitled',
    label: null,
    description: null,
    items: [],
    types: [],
    multiple: false,
    required: false,
    style: {},
    accessor: d => d,
    ...o,
  }

  /**
   * @description 已定义的维度，用以接收获取数据
   * @method dimension
   * @param {array|object} object 一行数据记录
   * @param {any} ext 扩展参数，作为第二个参数传递给 accessor，用以做猥琐的事情
   * @return 参数缺省: 返回该维度下所有字段的 key，否则: 对数据记录进行读取
   */
  var dimension = function(object, ext) {
    if (!dimension.value.length) {
      return null;
    }
    if (!arguments.length) {
      return dimension.value.map(function (d){
        return d.key;
      });
    }
    const { accessor } = info;
    const func = function (d, i){ 
      return accessor.call(dimension, d.key in object ? object[d.key] : object[i], ext, i); 
    };
    return info.multiple
      ? dimension.value.map(func) : func(dimension.value[0], 0);
  };

  /**
   * @description 获取该维度的所有信息
   * @method dimension.info
   * @return object
   */
  dimension.info = () => ({
    ...info,
    value: dimension.value
  });

  Object.keys(info).forEach((key) => {
    dimension[key] = function() {
      if (!arguments.length) return info[key];
      info[key] = arguments[0];
      return dimension;
    }
  });

  /**
   * @description 设置/读取维度共用的格式配置参数
   * @method dimension.format
   * @param {any} 格式化参数
   * @return 参数缺省返回 format 设置, or: dimension
   */
  dimension.format = (...format) => {
    info.format = format;
    return dimension;
  }

  /**
   * @description 读取/设置数据的获取器，默认 accessor 直接返回值，接受参数 (value, ext, index)
   * @method dimension.accessor
   * @param {function}
   */

  /**
   * @description 读取/设置维度值的是否多个条数的配置
   * @method dimension.multiple 
   * @param {bool}
   */

  function accessor(d){
    return d;
  }

  /**
   * @description 设置/读取维度值条数限制
   * @method dimension.required
   * @param {number|array}
   * @return 视参数是否缺省
   */
  dimension.required = function(_) {
    if (!arguments.length) return info.required;
    info.required = _;
    return dimension;
  }

  /**
   * @description 设置/获取维度值的类型
   * @method dimension.types
   * @param {any} 'METRIC', 'DIMENSION' 指标或维度
   * @return 视参数是否缺省
   */
  dimension.types = function() {
    if (!arguments.length) return info.types;
    var i = -1, n = arguments.length;
    info.types = [];
    while (++i < n) info.types.push(arguments[i]);
    return dimension;
  }

  /**
   * @description 设置/获取维度第一个值的类型
   * @method dimension.type
   */
  dimension.type = function() {
    if (!dimension.value[0] || !dimension.value[0].type) return;
    return info.multiple
      ? dimension.value.map(function (d){ return d.type })
      : dimension.value[0].type;
  }

  /**
   * @description 清空维度值
   * @method dimension.clear
   */
  dimension.clear = function() {
    dimension.value = [];
  }

  /**
   * @description 向维度内添加一个值，会根据 required, multiple 配置自动限制值的条数
   * @method dimension.add
   */
  dimension.add = function(...dimensions) {
    const { value } = dimension;
    const { required, multiple } = info;
    // 单条
    if (!multiple) {
      return value.splice(0, value.length, dimensions[0]);
    }
    // 区间
    dimensions.forEach((d) => {
      if (required && required[1] && value.length >= required[1]) return;
      if (value.indexOf(d) === -1) value.push(d);
    })
  }

  /**
   * @description 删除维度内的一个值
   */
  dimension.delete = function(d) {
    const { value } = dimension;
    const index = value.indexOf(d);
    if (index !== -1) value.splice(index , 1);
  }

  dimension.value = [];

  return dimension;
}

export {
  raw,
  $d3
};
