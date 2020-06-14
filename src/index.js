import { initMixin } from "./init";
import {renderMixin} from './render.js'
import {lifeCycleMixin} from './lifecircle.js'

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

export default Vue;