
export let newArrayProto=Object.create(Array.prototype);
 let oldMethods=Array.prototype;
 //需要重写数组的方法 
 let methods=[
       'push',
       'pop',
       'unshift',
       'shift',
       'splice',
       'sort',
       'reverst'
 ];
 methods.forEach((method)=>{
       newArrayProto[method]=function(...args){
              //依然执行原数组原型上的方法
              let result= oldMethods[method].call(this,...args);
              let insered=null,//新增的元素
                  ob=this._ob_
              switch(method){
                   case 'push':
                   case 'unshift':
                       insered=args;
                       break;
                    case 'splice':
                        insered=args.splice(2);
                        break;
                    default:
                        break;
                   
              }
              //对于新增元素进行观测
              insered && ob.observeArray(insered);
              return result;
       }
 })