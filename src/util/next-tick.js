/**
 * Vue 中的异步更新机制
 * @param {*} fn 
 */
let callBacks=[],pedding=false,timerFunc=null;
function flushCallbacks(){
      callBacks.forEach(cb=>{
            cb();
      })
      pedding=false;
}
export function nextTick(fn)
{
    callBacks.push(fn);
    
    if(!pedding){
        getTimerFunc();
        pedding=true;
        timerFunc();
    }
      
}
/**
 * 获得异步更新的方法
 */

function getTimerFunc(){
    //支持Promise
    if(Promise)
    {
        timerFunc=()=>Promise.resolve().then(flushCallbacks) 

    }
    else if(setImmediate){
        timerFunc=()=> setImmediate(flushCallbacks)
    }
    else {
        timerFunc=()=>setTimeout(flushCallbacks,0)
    }

}