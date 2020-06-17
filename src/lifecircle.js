import Watcher from './observe/watcher.js'
import {patch} from './vdom/patch';

/**
 * 生命周期
 */

 export function lifeCycleMixin(Vue){
     /**
      * 更新节点方法
      */
     Vue.prototype._update=function(vnode){
        const vm = this;

        vm.$el = patch(vm.$el,vnode);

     }
 }
 /**
  * 渲染
  * @param {*} vm 
  * @param {*} el 
  */

 export function mountComponent(vm,el){

    
    const updateComponent = () =>{
        // 内部会调用刚才我们解析后的render方法 =》 vnode
        // _render => options.render 方法
        // _update => 将虚拟dom 变成真实dom 来执行
        vm._update(vm._render()); 
    }

    // 每次数据变化 就执行 updateComponent 方法 进行更新操作
    new Watcher(vm, updateComponent, () => {}, true);



 }