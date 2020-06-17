
const LIFECYCLE_HOOKS =[
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
]
//存放策略
let strats={

}

LIFECYCLE_HOOKS.forEach((hook)=>{
      strats[hook]=mergeHook;
})
/**
 * 合并生命周期的钩子
 * @param {*} hook 
 * 
 */

function mergeHook(parentValue,childValue){
    //有子
    if(childValue){
        //有父
        if(parentValue)
        {
            //合并
            return parentValue.concat(childValue);

        }
        else{
            //返回
              return [childValue];
        }
          
    }
    else{
         return parentValue;
    }
      

}
/**
 * 判断是否是对象
 */

 export function isObject(obj){
    return typeof obj==='object' && obj!==null;
      
}

export function isReallyObject(obj){
  
      return getObjType(obj)==='Object'

}

export function getObjType(obj){
    return Object.prototype.toString.call(obj).slice(8,-1);

}

export function mergeOptions(parent,child){
      const options={};
       for(let key in parent)
       {
            mergeFields(key)

       }

       for(let key in child)
       {
           
            if(!parent.hasOwnProperty[key]){
                  mergeFields(key)
            }
       }
       /**
        * 合并属性
        * @param {*} key 
        */

       function mergeFields(key){
          
           //如果策略模式上存在
           if(strats[key]){
                 options[key]=strats[key](parent[key],child[key])
           }
    
           //如果都是对象 {a:11,b:2},{a:12,c:14} =>{a:12,b:2,c:14}
           else if(isReallyObject(parent[key]) && isReallyObject(child[key] ))
           {
                 options[key]={
                       ...parent[key],
                       ...child[key]
                  }

           }
           else if(child[key]){
                 options[key]=child[key]
           }

           console.log(key);
           

           
    
       }
       return options;
    
      
}

