'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _Luy = require('./Luy');

var _Luy2 = _interopRequireDefault(_Luy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 * @author paulirish / http://paulirish.com/
 */
var MemoryStats = function MemoryStats() {

  var msMin = 100;
  var msMax = 0;

  var container = document.createElement('div');
  container.id = 'stats';
  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

  var msDiv = document.createElement('div');
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
  container.appendChild(msDiv);

  var msText = document.createElement('div');
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'Memory';
  msDiv.appendChild(msText);

  var msGraph = document.createElement('div');
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild(msGraph);

  while (msGraph.children.length < 74) {

    var bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild(bar);
  }

  var updateGraph = function updateGraph(dom, height, color) {

    var child = dom.appendChild(dom.firstChild);
    child.style.height = height + 'px';
    if (color) child.style.backgroundColor = color;
  };

  var perf = window.performance || {};
  // polyfill usedJSHeapSize
  if (!perf && !perf.memory) {
    perf.memory = { usedJSHeapSize: 0 };
  }
  if (perf && !perf.memory) {
    perf.memory = { usedJSHeapSize: 0 };
  }

  // support of the API?
  if (perf.memory.totalJSHeapSize === 0) {
    console.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .');
  }

  // TODO, add a sanity check to see if values are bucketed.
  // If so, reminde user to adopt the --enable-precise-memory-info flag.
  // open -a "/Applications/Google Chrome.app" --args --enable-precise-memory-info

  var lastTime = Date.now();
  var lastUsedHeap = perf.memory.usedJSHeapSize;
  return {
    domElement: container,

    update: function update() {

      // refresh only 30time per second
      if (Date.now() - lastTime < 1000 / 30) return;
      lastTime = Date.now();

      var delta = perf.memory.usedJSHeapSize - lastUsedHeap;
      lastUsedHeap = perf.memory.usedJSHeapSize;
      var color = delta < 0 ? '#830' : '#131';

      var ms = perf.memory.usedJSHeapSize;
      msMin = Math.min(msMin, ms);
      msMax = Math.max(msMax, ms);
      msText.textContent = "Mem: " + bytesToSize(ms, 2);

      var normValue = ms / (30 * 1024 * 1024);
      var height = Math.min(30, 30 - normValue * 30);
      updateGraph(msGraph, height, color);

      function bytesToSize(bytes, nFractDigit) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
        var precision = Math.pow(10, nFractDigit);
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
      };
    }

  };
};

var Monitoring = Monitoring || function () {

  var stats = new MemoryStats();
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.right = '0px';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild(stats.domElement);
  requestAnimationFrame(function rAFloop() {
    stats.update();
    requestAnimationFrame(rAFloop);
  });

  var RenderRate = function RenderRate() {
    var container = document.createElement('div');
    container.id = 'stats';
    container.style.cssText = 'width:150px;opacity:0.9;cursor:pointer;position:fixed;right:80px;bottom:0px;';

    var msDiv = document.createElement('div');
    msDiv.id = 'ms';
    msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
    container.appendChild(msDiv);

    var msText = document.createElement('div');
    msText.id = 'msText';
    msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    msText.innerHTML = 'Repaint rate: 0/sec';
    msDiv.appendChild(msText);

    var bucketSize = 20;
    var bucket = [];
    var lastTime = Date.now();
    return {
      domElement: container,
      ping: function ping() {
        var start = lastTime;
        var stop = Date.now();
        var rate = 1000 / (stop - start);
        bucket.push(rate);
        if (bucket.length > bucketSize) {
          bucket.shift();
        }
        var sum = 0;
        for (var i = 0; i < bucket.length; i++) {
          sum = sum + bucket[i];
        }
        msText.textContent = "Repaint rate: " + (sum / bucket.length).toFixed(2) + "/sec";
        lastTime = stop;
      }
    };
  };

  var renderRate = new RenderRate();
  document.body.appendChild(renderRate.domElement);

  return {
    memoryStats: stats,
    renderRate: renderRate
  };
}();

var ENV = ENV || function () {

  var _base;

  (_base = String.prototype).lpad || (_base.lpad = function (padding, toLength) {
    return padding.repeat((toLength - this.length) / padding.length).concat(this);
  });

  function formatElapsed(value) {
    var str = parseFloat(value).toFixed(2);
    if (value > 60) {
      minutes = Math.floor(value / 60);
      comps = (value % 60).toFixed(2).split('.');
      seconds = comps[0].lpad('0', 2);
      ms = comps[1];
      str = minutes + ":" + seconds + "." + ms;
    }
    return str;
  }

  function getElapsedClassName(elapsed) {
    var className = 'Query elapsed';
    if (elapsed >= 10.0) {
      className += ' warn_long';
    } else if (elapsed >= 1.0) {
      className += ' warn';
    } else {
      className += ' short';
    }
    return className;
  }

  var lastGeneratedDatabases = [];

  function getData() {
    // generate some dummy data
    var data = {
      start_at: new Date().getTime() / 1000,
      databases: {}
    };

    for (var i = 1; i <= ENV.rows; i++) {
      data.databases["cluster" + i] = {
        queries: []
      };

      data.databases["cluster" + i + "slave"] = {
        queries: []
      };
    }

    (0, _keys2.default)(data.databases).forEach(function (dbname) {

      if (lastGeneratedDatabases.length == 0 || Math.random() < ENV.mutations()) {
        var info = data.databases[dbname];
        var r = Math.floor(Math.random() * 10 + 1);
        for (var i = 0; i < r; i++) {
          var elapsed = Math.random() * 15;
          var q = {
            canvas_action: null,
            canvas_context_id: null,
            canvas_controller: null,
            canvas_hostname: null,
            canvas_job_tag: null,
            canvas_pid: null,
            elapsed: elapsed,
            formatElapsed: formatElapsed(elapsed),
            elapsedClassName: getElapsedClassName(elapsed),
            query: "SELECT blah FROM something",
            waiting: Math.random() < 0.5
          };

          if (Math.random() < 0.2) {
            q.query = "<IDLE> in transaction";
          }

          if (Math.random() < 0.1) {
            q.query = "vacuum";
          }

          info.queries.push(q);
        }

        info.queries = info.queries.sort(function (a, b) {
          return b.elapsed - a.elapsed;
        });
      } else {
        data.databases[dbname] = lastGeneratedDatabases[dbname];
      }
    });

    lastGeneratedDatabases = data.databases;

    return data;
  }

  var lastDatabases = {
    toArray: function toArray() {
      return (0, _keys2.default)(this).filter(function (k) {
        return k !== 'toArray';
      }).map(function (k) {
        return this[k];
      }.bind(this));
    }
  };

  function generateData() {
    var databases = [];
    var newData = getData();
    (0, _keys2.default)(newData.databases).forEach(function (dbname) {
      var sampleInfo = newData.databases[dbname];
      var database = {
        dbname: dbname,
        samples: []
      };

      function countClassName(queries) {
        var countClassName = "label";
        if (queries.length >= 20) {
          countClassName += " label-important";
        } else if (queries.length >= 10) {
          countClassName += " label-warning";
        } else {
          countClassName += " label-success";
        }
        return countClassName;
      }

      function topFiveQueries(queries) {
        var tfq = queries.slice(0, 5);
        while (tfq.length < 5) {
          tfq.push({ query: "", formatElapsed: '', elapsedClassName: '' });
        }
        return tfq;
      }

      var samples = database.samples;
      samples.push({
        time: newData.start_at,
        queries: sampleInfo.queries,
        topFiveQueries: topFiveQueries(sampleInfo.queries),
        countClassName: countClassName(sampleInfo.queries)
      });
      if (samples.length > 5) {
        samples.splice(0, samples.length - 5);
      }
      var samples = database.samples;
      database.lastSample = database.samples[database.samples.length - 1];
      databases.push(database);
    });
    return {
      toArray: function toArray() {
        return databases;
      }
    };
  }

  var mutationsValue = 0.5;

  function mutations(value) {
    if (value) {
      mutationsValue = value;
      return mutationsValue;
    } else {
      return mutationsValue;
    }
  }

  var body = document.querySelector('body');
  var theFirstChild = body.firstChild;

  var sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = "display: flex";
  var slider = document.createElement('input');
  var text = document.createElement('label');
  text.innerHTML = 'mutations : ' + (mutationsValue * 100).toFixed(0) + '%';
  text.id = "ratioval";
  slider.setAttribute("type", "range");
  slider.style.cssText = 'margin-bottom: 10px; margin-top: 5px';
  slider.addEventListener('change', function (e) {
    ENV.mutations(e.target.value / 100);
    document.querySelector('#ratioval').innerHTML = 'mutations : ' + (ENV.mutations() * 100).toFixed(0) + '%';
  });
  sliderContainer.appendChild(text);
  sliderContainer.appendChild(slider);
  body.insertBefore(sliderContainer, theFirstChild);

  return {
    generateData: generateData,
    rows: 50,
    timeout: 0,
    mutations: mutations
  };
}();

var DBMon = function (_React$Component) {
  (0, _inherits3.default)(DBMon, _React$Component);

  function DBMon(props) {
    (0, _classCallCheck3.default)(this, DBMon);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DBMon.__proto__ || (0, _getPrototypeOf2.default)(DBMon)).call(this, props));

    _this.state = {
      databases: []
    };
    return _this;
  }

  (0, _createClass3.default)(DBMon, [{
    key: 'loadSamples',
    value: function loadSamples() {
      this.setState({
        databases: ENV.generateData().toArray()
      });
      Monitoring.renderRate.ping();
      setTimeout(this.loadSamples.bind(this), ENV.timeout);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadSamples();
    }
  }, {
    key: 'render',
    value: function render() {
      return _Luy2.default.createElement(
        'div',
        { id: 'container' },
        _Luy2.default.createElement(
          'table',
          { className: 'table table-striped latest-data' },
          _Luy2.default.createElement(
            'tbody',
            null,
            ' ',
            this.state.databases.map(function (database) {
              return _Luy2.default.createElement(
                'tr',
                { key: database.dbname },
                _Luy2.default.createElement(
                  'td',
                  { className: 'dbname' },
                  ' ',
                  database.dbname,
                  ' '
                ),
                _Luy2.default.createElement(
                  'td',
                  { className: 'query-count' },
                  _Luy2.default.createElement(
                    'span',
                    { className: database.lastSample.countClassName },
                    database.lastSample.queries.length
                  )
                ),
                database.lastSample.topFiveQueries.map(function (query, index) {
                  return _Luy2.default.createElement(
                    'td',
                    { className: "Query " + query.elapsedClassName },
                    query.formatElapsed,
                    ' ',
                    _Luy2.default.createElement(
                      'div',
                      { className: 'popover left' },
                      _Luy2.default.createElement(
                        'div',
                        { className: 'popover-content' },
                        ' ',
                        query.query,
                        ' '
                      ),
                      _Luy2.default.createElement('div', { className: 'arrow' })
                    )
                  );
                })
              );
            }),
            ' '
          )
        )
      );
    }
  }]);
  return DBMon;
}(_Luy2.default.Component);

;

_Luy2.default.render(_Luy2.default.createElement(DBMon, null), document.getElementById('dbmon'));
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(MemoryStats, 'MemoryStats', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(Monitoring, 'Monitoring', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(ENV, 'ENV', 'app/src/app.js');

  __REACT_HOT_LOADER__.register(DBMon, 'DBMon', 'app/src/app.js');
}();

;