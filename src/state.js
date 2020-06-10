
import {observe} from './observe/index.js'
export let initState=(vm)=>{
     initData(vm)
       
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
        observe(data)
    }
     
       
}