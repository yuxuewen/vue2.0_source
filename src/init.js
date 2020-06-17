/**
 * 初始化
 */
import {initState} from './state.js';
import {compileToFunctions} from './complier/index.js'
import {mountComponent,callHook} from './lifecycle.js'
import {  mergeOptions} from "./util/index.js";

 export let  initMixin=(Vue)=>{
        /**
         * 在原型上添加初始化的方法
         */
        Vue.prototype._init=function(options){
             const vm=this;
             
             //将参数挂载到 vm 上
             vm.$options = mergeOptions(vm.constructor.options,options);
             callHook(vm,'beforeCreate');
             initState(vm);
             callHook(vm,'created');
           
             

            if(vm.$options.el)
            {
                 this.$mount(vm.$options.el);
            }
        }
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
       
        Vue.prototype.$mount=function(el){
             const vm=this;
             el=vm.$el=document.querySelector(el);
             const {render,template}=vm.$options;
             //render 必须是一个函数
             if(!render ||  typeof render!=='function')
             {
                  //有模板取模板
                   let _template=template || el.outerHTML;
                   //将模板解析成ast语法树
                   const render=compileToFunctions(_template);
                   vm.$options.render=render;

             }
             mountComponent(vm,el); // 组件的挂载流程
             callHook(vm,'mounted');
                
        }
        
  }
