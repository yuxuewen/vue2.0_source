let id=0;
/**
 * 
 */
class Dep{
      constructor(){
            this.id=id++; //dep 的唯一标识
            this.subs=[]; //存储 watcher
            this.subsId=new Set();
      }
      /**
       * 让watcher 记忆 dep
       */
      depend(){
            Dep.target.addDep(this);
      }

      /**
       * 订阅
       * @param {*} watcher 
       */

      addSubs(watcher){
          if(!this.subsId.has(watcher.id))
          {
               this.subs.push(watcher);
               this.subsId.add(watcher.id);

          }
         

      }
      /**
       * 更新
       */
      notify(){
            this.subs.forEach(watcher=>watcher.update())
      }
}
/**
 * watcher 调用此方法
 */
Dep.target=null;
export  function pushTarget(watcher)
{
    Dep.target=watcher;

}

export function popTarget(watcher)
{
    Dep.target=null;
}

export default Dep;