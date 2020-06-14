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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  function proxy(target, source, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[source][key];
      },
      set: function set(newValue) {
        target[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var options = vm.$options;

    if (options.data) {
      // 如果 data 是函数得到函数执行的返回值
      var data = typeof options.data === 'function' ? options.data.call(vm) : options.data;
      console.log("\u9700\u8981\u89C2\u6D4B\u7684\u503C".concat(data.toString()));
      console.log(data);
      vm._data = data;

      for (var key in data) {
        proxy(vm, '_data', key);
      }

      observe(data);
    }
  }

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
  var ELEMENT_NDOE = '1';
  var TEXT_NODE = '3';
  function parseHTML(html) {
    console.log(html); // ast 树 表示html的语法

    var root; // 树根 

    var currentParent;
    var elementStack = []; // 

    /**
     * ast 语法元素
     * @param {*} tagName 
     * @param {*} attrs 
     */

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        //标签
        attrs: attrs,
        //属性
        children: [],
        //子节点
        parent: null,
        //父节点
        type: ELEMENT_NDOE //节点类型

      };
    } // console.log(html)


    function start(tagName, attrs) {
      //创建跟节点
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; //最新解析的元素

      elementStack.push(element); //元素入栈 //可以保证 后一个是的parent 是他的前一个
    }

    function end(tagName) {
      // 结束标签
      //最后一个元素出栈 
      var element = elementStack.pop();
      var parent = elementStack[elementStack.length - 1]; //节点前后不一致，抛出异常

      if (element.tag !== tagName) {
        throw new TypeError("html tag is error ".concat(tagName));
      }

      console.log(parent);

      if (parent) {
        //子元素的parent 指向
        element.parent = parent; //将子元素添进去

        parent.children.push(element);
      }
    }
    /**
     * 解析到文本
     * @param {*} text 
     */


    function chars(text) {
      // 文本
      //解析到文本
      text = text.replace(/\s/g, ''); //将文本加入到当前元素

      currentParent.children.push({
        type: TEXT_NODE,
        text: text
      });
    } // 根据 html 解析成树结构  </span></div>


    while (html) {
      //如果是html 标签
      var textEnd = html.indexOf('<');

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
    /**
     * 解析开始标签
     * <div id='app'> ={ tagName:'div',attrs:[{id:app}]}
     */


    function parseStartTag() {
      var start = html.match(startTagOpen); // 匹配开始标签

      if (start) {
        var match = {
          tagName: start[1],
          // 匹配到的标签名
          attrs: []
        };
        advance(start[0].length);

        var _end, attr; //开始匹配属性 如果没有匹配到标签的闭合 并且比配到标签的 属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配 {{}}
  // let str='11{{33}}{{4}}44'
  // console.log(defaultTagRE.exec(str))
  // [ '{{33}}',匹配到元素
  //   '33',   //匹配的结果
  //   index: 2,
  //   input: '11{{33}}{{4}}44',
  //   groups: undefined ]

  /**
   * 属性
   * @param {*} attrs 
   */

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; //目前暂时处理 style 特殊情况 例如 @click v-model 都得特殊处理
      // {
      //     name:'style',
      //     value:'color:red;border:1px'
      // }

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (element) {
            var _element$split = element.split(':'),
                _element$split2 = _slicedToArray(_element$split, 2),
                _element$split2$ = _element$split2[0],
                key = _element$split2$ === void 0 ? '' : _element$split2$,
                _element$split2$2 = _element$split2[1],
                value = _element$split2$2 === void 0 ? '' : _element$split2$2;

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(el) {
    //还是元素节点
    if (el.type === '1') {
      return generate(el);
    } else {
      var text = el.text;
      if (!text) return; //一次解析

      if (defaultTagRE.test(el.text)) {
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0,
            //上一次的匹配后的索引
        index = 0,
            match = [],
            result = [];

        while (match = defaultTagRE.exec(text)) {
          index = match.index; //先将 bb{{aa}} 中的 bb 添加

          result.push("".concat(JSON.stringify(text.slice(lastIndex, index)))); //添加匹配的结果

          result.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
          console.log(lastIndex);
        } //例如：11{{sd}}{{sds}}23 此时 23还未添加


        if (lastIndex < text.length) {
          //result.push(`_v(${JSON.stringify(text.slice(lastIndex))})`);
          result.push(JSON.stringify(text.slice(lastIndex)));
        }

        console.log(result); //返回

        return "_v(".concat(result.join('+'), ")");
      } //没有变量
      else {
          return "_v(".concat(JSON.stringify(text), ")");
        }
    }
  }
  /**
   * 解析子元素
   * @param {*} el 
   */


  function genChildren(el) {
    var children = el.children;

    if (children.length > 0) {
      var resList = [];

      for (var i = 0; i < children.length; i++) {
        var res = gen(children[i]);
        if (res) resList.push(res);
      }

      return resList.join(',');
    }

    return false;
  } // return _c('div',{class:'a'},_c('span',null,123,_v('hello')+_v(age))+_v(msg)))
  //三部分 标签，属性，子


  function generate(el) {
    var children = genChildren(el); // 生成孩子字符串

    var result = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : undefined).concat(children ? ",".concat(children) : undefined, ")");
    return result;
  }

  function compileToFunctions(template) {
    //解析成 ast 树形元素
    var ast = parseHTML(template);
    var astStr = generate(ast); //_c("div",id:"app",_v(""),_c("div",class:"content",_v(_v("主页面"),_s(name),_v("e}}"),_s(age),_v(e}})),_v("")),_c("p",style:{"color":"red"},_v("静态节点"),_v("")))
    //转为
    //astStr='_c("div",{id:"app"},,_c("div",{class:"content"},_v(_v("主页面"),_s(name)),),_c("p",{style:{"color":"red"}},_v("静态节点"),))'

    var renderFnStr = "with(this){ \r\nreturn ".concat(astStr, " \r\n}");
    console.log(astStr);
    var render = new Function(renderFnStr);
    console.log(render); //render();

    return render;
  }

  var Watcher = function Watcher(vm, exprOrFn, cb, options) {
    _classCallCheck(this, Watcher);

    exprOrFn();
  };

  function patch(oldVnode, newVnode) {
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 真实元素
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode;
      console.log(newVnode);
      var el = createElement(newVnode);
      console.log(el); //查询新的

      parentElm.insertBefore(el, oldElm.nextSibling); //移除旧元素

      parentElm.removeChild(oldElm);
      return el; // 渲染的真实dom
    }
  }
  /**
   * 創建元素
   * @param {*} vnode 
   */

  function createElement(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        key = vnode.key,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProps(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElement(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  /**
   * 
   * @param {*} el 
   * @param {*} data 
   */


  function updateProps(vnode) {
    var el = vnode.el,
        data = vnode.data;

    for (var key in data) {
      if (key === 'style') {
        for (var styleName in data[key]) {
          el.style[styleName] = data[key][styleName];
        }
      } else {
        el.setAttribute(key, data[key]);
      }
    }
  }

  /**
   * 生命周期
   */

  function lifeCycleMixin(Vue) {
    /**
     * 更新节点方法
     */
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  /**
   * 渲染
   * @param {*} vm 
   * @param {*} el 
   */

  function mountComponent(vm, el) {
    var updateComponent = function updateComponent() {
      // 内部会调用刚才我们解析后的render方法 =》 vnode
      // _render => options.render 方法
      // _update => 将虚拟dom 变成真实dom 来执行
      vm._update(vm._render());
    }; // 每次数据变化 就执行 updateComponent 方法 进行更新操作


    new Watcher(vm, updateComponent, function () {}, true);
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
      el = vm.$el = document.querySelector(el);
      var _vm$$options = vm.$options,
          render = _vm$$options.render,
          template = _vm$$options.template; //render 必须是一个函数

      if (!render || typeof render !== 'function') {
        //有模板取模板
        var _template = template || el.outerHTML; //将模板解析成ast语法树


        var _render = compileToFunctions(_template);

        vm.$options.render = _render;
      }

      mountComponent(vm); // 组件的挂载流程
    };
  };

  /**
   * 创建节点
   * @param {*} param0 
   */
  function createElement$1(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vNode(tag, data, data.key, children, undefined);
  }
  /**
   * 文本节点
   * @param {*} text 
   */

  function createNodeText(text) {
    console.log(text);
    return vNode(undefined, undefined, undefined, undefined, text);
  }
  /**
   * 虚拟节点
   */

  function vNode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; //创建节点

      Vue.prototype._c = function () {
        return createElement$1.apply(void 0, arguments);
      }; //创建文本节点


      Vue.prototype._v = function (text) {
        return createNodeText(text);
      };

      Vue.prototype._s = function (val) {
        console.log(val === null ? "" : _typeof(val) === 'object' ? JSON.stringify(val) : val);
        return val === null ? "" : _typeof(val) === 'object' ? JSON.stringify(val) : val;
      }; //执行


      var node = render.call(vm);
      console.log(node);
      return node;
    };
  }

  /**
   * vue 入口文件
   * @param {*} options 
   */

  function Vue(options) {
    this._init(options);
  } //扩展 Vue方法


  initMixin(Vue); //Render 方法

  renderMixin(Vue); //注入生命周期

  lifeCycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
