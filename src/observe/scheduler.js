 import {nextTick} from '../util/next-tick.js'
 let watcherId={};
 let quene=[]; //更新对列
 
 export function queneWatcher(wathcer)
 {    
       if(!watcherId[wathcer.id])
       {
           quene.push(wathcer);
           //异步的 所以可以等到同步中 quene 添加完毕才会执行
           nextTick(flushSchedulerQueue);
           watcherId[wathcer.id]=true;
       }

 }
/**
 * 
 *  watcher 对列执行
 * @param {*} quene 
 */
 function flushSchedulerQueue(){
     
    for(let i=0;i<quene.length;i++)
    {
        quene[i].run();

    }
    quene=[];
    watcherId={};

 }