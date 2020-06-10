import { initMixin } from "./init";

/**
 * vue 入口文件
 * @param {*} options 
 */
function Vue(options){
    this._init(options);

}
//扩展 Vue方法
initMixin(Vue);
export default Vue;