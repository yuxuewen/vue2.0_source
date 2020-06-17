import { initMixin } from "./init";
import {renderMixin} from './render.js'
import {lifeCycleMixin} from './lifecycle.js'
import {  initGlobalApi} from "./globalApi.js";

/**
 * vue 入口文件
 * @param {*} options 
 */
function Vue(options){
    this._init(options);

}
//扩展 Vue方法
initMixin(Vue);
//Render 方法
renderMixin(Vue);
//注入生命周期
lifeCycleMixin(Vue);
//注入全局API
initGlobalApi(Vue);

export default Vue;