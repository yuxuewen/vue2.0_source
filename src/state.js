
import {observe} from './observe/index.js'
export let initState=(vm)=>{
     initData(vm)
       
}
/**
 * 代理 vm[key] 
 *      vm['_data'][key]
 * @param {*} target 
 * @param {*} source 
 * @param {*} key 
 */
function proxy(target,source,key){
    Object.defineProperty(target,key,{
         get(){
             return target[source][key]

         },
         set(newValue){
            target[source][key]=newValue;

         }
    })

}

function initData(vm){
    const options=vm.$options;
    if(options.data)
    {
        // 如果 data 是函数得到函数执行的返回值
        let  data=typeof options.data==='function'?(options.data).call(vm):options.data;
        console.log(`需要观测的值${data.toString()}`);
        console.log(data)
        vm._data=data;
        for(let key in data)
        {
            proxy(vm,'_data',key)

        }
        observe(data)
    }
     
       
}