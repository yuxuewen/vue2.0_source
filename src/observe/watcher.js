import {pushTarget,popTarget} from './dep'
import {queneWatcher} from './scheduler.js'
let id=0;
class Watcher{
    constructor(vm,exprOrFn,cb,options){
        this.vm=vm;
        this.cb=cb;
        this.options;
        this.deps=[];
        if(typeof exprOrFn==='function')
        {
              this.getter=exprOrFn;
        }
       
        this.id=id++;
        //记忆存储的dep 的id
        this.depIds=new Set();
        this.get();
    }

    get(){
        pushTarget(this);
        //渲染视图 
        this.getter();
        //收集依赖已完成,移除
        popTarget();
    }

    run(){
        this.get();
    }
    /**
     * 更新
     */
    update(){
        
        //this.get();
        //加入更新对列中
        console.log(`触发了更新`);
        queneWatcher(this)

    }
    /**
     * 
     * @param {*} dep 
     */
    addDep(dep){
        if(!this.depIds.has(dep.id))
        {
            this.deps.push(dep);
            this.depIds.add(dep.id);
            //dep 记忆 watcher
            dep.addSubs(this);

        }


    }
}


export default Watcher