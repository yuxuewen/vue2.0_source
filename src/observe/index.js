/**
 * 数据观测
 */
import {isObject} from '../util/index.js'
import {newArrayProto} from './array'
 class Observer{
       constructor(data)
       {
            //将 this 挂载在data 上 可以使用ob 调用方法
             Object.defineProperty(data,'_ob_',{
                   enumerable:false,
                   configurable:false,
                   value:this
             })

             if(data instanceof Array)
             {
                 //数组是 [].__proto__=Array.prototype
                 //更改需要观测数组的原型链
                 data.__proto__=newArrayProto;
                 this.observeArray(data);
             }
             else{
                 //监测对象
                  this.walk(data);
             }

             
       }
       /**
        * 观测数组
        * @param {*} data 
        */
       observeArray(data){

          for(let i=0;i<data.length;i++)
          {
              observe(data[i])
          }

       }
       /**
        * 遍历监测对象
        * @param {*} data 
        */
       walk(data){
          //  Object.keys 不可遍历不可枚举类型 所以 _ob_ 不会被遍历
         Object.keys(data).forEach(key=>{
             defineReactive(data,key,data[key])
         })
       }


 }
 /**
  * 数据监测
  * @param {*} data 
  * @param {*} key 
  * @param {*} value 
  */

 function defineReactive(data,key,value){
       observe(value);// value 还是对象，递归
       Object.defineProperty(data,key,{
           get(){
               return value;

           },
           set(newValue){
               if(newValue===value) return;
               //对于赋值的如果是对象 进行响应式监测
               observe(newValue);
           }
       })

 }
 /**
  * 观测数据方法
  * @param {*} data 
  */

 export function observe(data)
 {
       //不是对象
       if(!isObject(data)) return;
       //说明已经被观测
       if(data._ob_ instanceof Observer) return;
       return new Observer(data);
 }

