import {createElement,createNodeText} from './vdom/create-element.js'
export function renderMixin(Vue){
    Vue.prototype._render=function(){
        const vm=this;
        const {render}=vm.$options;
        //创建节点
        Vue.prototype._c=function(){
            
            return createElement(...arguments);

        }
        //创建文本节点
        Vue.prototype._v=function(text){
            return createNodeText(text);

        }
        Vue.prototype._s=function(val){
            console.log(val===null?"":(typeof val==='object'?JSON.stringify(val):val));
            
            return val===null?"":(typeof val==='object'?JSON.stringify(val):val);

        }
        
        //执行
        let node=render.call(vm);
        console.log(node);
    
        return node;
    }

}