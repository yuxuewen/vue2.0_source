import {  mergeOptions} from "./util/index.js";
/*
   初始化全局的API
*/
export function initGlobalApi(Vue){
        Vue.options={};
        Vue.Mixin=function(mixin){
           this.options=mergeOptions(this.options,mixin);
           return this;
       }

}