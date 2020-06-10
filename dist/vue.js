(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 判断是否是对象
   */
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }

  var newArrayProto = Object.create(Array.prototype);
  var oldMethods = Array.prototype; //需要重写数组的方法 

  var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverst'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldMethods$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //依然执行原数组原型上的方法
      var result = (_oldMethods$method = oldMethods[method]).call.apply(_oldMethods$method, [this].concat(args));

      var insered = null,
          //新增的元素
      ob = this._ob_;

      switch (method) {
        case 'push':
        case 'unshift':
          insered = args;
          break;

        case 'splice':
          insered = args.splice(2);
          break;
      } //对于新增元素进行观测


      insered && ob.observeArray(insered);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //将 this 挂载在data 上 可以使用ob 调用方法
      Object.defineProperty(data, '_ob_', {
        enumerable: false,
        configurable: false,
        value: this
      });

      if (data instanceof Array) {
        //数组是 [].__proto__=Array.prototype
        //更改需要观测数组的原型链
        data.__proto__ = newArrayProto;
        this.observeArray(data);
      } else {
        //监测对象
        this.walk(data);
      }
    }
    /**
     * 观测数组
     * @param {*} data 
     */


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
      /**
       * 遍历监测对象
       * @param {*} data 
       */

    }, {
      key: "walk",
      value: function walk(data) {
        //  Object.keys 不可遍历不可枚举类型 所以 _ob_ 不会被遍历
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();
  /**
   * 数据监测
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */


  function defineReactive(data, key, value) {
    observe(value); // value 还是对象，递归

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return; //对于赋值的如果是对象 进行响应式监测

        observe(newValue);
      }
    });
  }
  /**
   * 观测数据方法
   * @param {*} data 
   */


  function observe(data) {
    //不是对象
    if (!isObject(data)) return; //说明已经被观测

    if (data._ob_ instanceof Observer) return;
    return new Observer(data);
  }

  var initState = function initState(vm) {
    initData(vm);
  };

  function initData(vm) {
    var options = vm.$options;

    if (options.data) {
      // 如果 data 是函数得到函数执行的返回值
      var data = typeof options.data === 'function' ? options.data.call(vm) : options.data;
      console.log("\u9700\u8981\u89C2\u6D4B\u7684\u503C".concat(data.toString()));
      console.log(data);
      vm._data = data;
      observe(data);
    }
  }

  //正则表达（太复杂了！！！）
  //              字母a-zA-Z_ - . 数组小写字母 大写字母  
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获   <aaa:aaa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  // 闭合标签 </xxxxxxx>  

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // <div aa   =   "123"  bb=123  cc='123'
  // 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // <div >   <br/>

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHtml(html) {
    function start(tagName, attrs) {
      console.log(tagName, attrs);
    }

    function end(tagName) {
      console.log(tagName);
    }

    function chars(text) {
      console.log(text);
    } // 根据 html 解析成树结构  </span></div>


    while (html) {
      var textEnd = html.indexOf('<'); //表明是标签

      if (textEnd == 0) {
        var startTageMatch = parseStartTag();

        if (startTageMatch) {
          // 开始标签
          start(startTageMatch.tagName, startTageMatch.attrs);
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        } // 结束标签 

      } // 如果不是0 说明是文本


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd); // 是文本就把文本内容进行截取

        chars(text);
      }

      if (text) {
        advance(text.length); // 删除文本内容
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // 匹配开始标签

      if (start) {
        var match = {
          tagName: start[1],
          // 匹配到的标签名
          attrs: []
        }; //将标签名移除

        advance(start[0].length);

        var _end, attr; //开始匹配标签中属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //每匹配成功就要移除
          advance(attr[0].length); //添加属性

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          //移除节点  匹配标签结束的 >
          advance(_end[0].length);
          return match;
        }
      }
    }
  } // var html='<button type="submit" id="register-submit-btn" class="btn blue pull-right">注册 <i class="m-icon-swapright m-icon-white"></i>/button>            '
  // parseHtml(html);

  /**
   * 解析器
   * @param {*} templete 模板
   */

  function compileToFunctions(templete) {
    return parseHtml(templete);
  }

  /**
   * 初始化
   */
  var initMixin = function initMixin(Vue) {
    /**
     * 在原型上添加初始化的方法
     */
    Vue.prototype._init = function (options) {
      var vm = this; //将参数挂载到 vm 上

      vm.$options = options;
      initState(vm);

      if (vm.$options.el) {
        this.$mount(vm.$options.el);
      }
    };
    /**
     * 挂载
     * 三种: render 函数 >template 模板 >取html页面的模板
     * 
     * new Vue({
          el:"#app"
         template:'<div>{{msg}}</div>',
      //ast 语法树
      render:()=>{
        },
      data:()=>{
            return {
              }
      }
    })._mount('#app');
     */


    Vue.prototype.$mount = function (el) {
      var vm = this;
      var _vm$$options = vm.$options,
          render = _vm$$options.render,
          template = _vm$$options.template; //render 必须是一个函数

      if (!render || typeof render !== 'function') {
        //有模板取模板
        var _template = template || document.querySelector(el).outerHTML; //将模板解析成ast语法树


        var _render = compileToFunctions(_template);

        vm.$options.render = _render;
      }
    };
  };

  /**
   * vue 入口文件
   * @param {*} options 
   */

  function Vue(options) {
    this._init(options);
  } //扩展 Vue方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
