/**
 * 初始化
 */
import {initState} from './state.js';
import {compileToFunctions} from './compiler/index.js'
 export let  initMixin=(Vue)=>{
        /**
         * 在原型上添加初始化的方法
         */
        Vue.prototype._init=function(options){
             const vm=this;
             //将参数挂载到 vm 上
             vm.$options=options;
             initState(vm);
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
             const {render,template}=vm.$options;
             //render 必须是一个函数
             if(!render ||  typeof render!=='function')
             {
                  //有模板取模板
                   let _template=template || document.querySelector(el).outerHTML;
                   //将模板解析成ast语法树
                   const render=compileToFunctions(_template);
                   vm.$options.render=render;

             }
             
                
        }
        
  }
