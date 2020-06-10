/**
 * 初始化
 */
import {initState} from './state.js';
 export let  initMixin=(Vue)=>{
        /**
         * 在原型上添加初始化的方法
         */
        Vue.prototype._init=function(options){
             const vm=this;
             //将参数挂载到 vm 上
             vm.$options=options;
             initState(vm);
        }
        
  }
