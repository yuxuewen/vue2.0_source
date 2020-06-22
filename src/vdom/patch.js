export function patch(oldVnode,newVnode){
    const isRealElement = oldVnode.nodeType;

    if(isRealElement){
        // 真实元素
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;
        console.log(newVnode);
        let el = createElement(newVnode);
        console.log(el);
        //查询新的
        parentElm.insertBefore(el,oldElm.nextSibling)
        //移除旧元素
        parentElm.removeChild(oldElm);
        return el; // 渲染的真实dom
    }else{
        // dom diff 算法
        // 比较
        //不是相同节点，直接替换
        if(!isSameNode(oldVnode,newVnode))
        {
            //老节点直接被替换成新节点
            oldVnode.el.parentNode.replaceChild(createElement(newVnode), oldVnode.el);
        }
        //如果都是文本节点，替换
        if(!oldVnode.tag)
        {
             if(oldVnode.text!==newVnode.text)
             {
                 oldVnode.el.textContent=newVnode.text;
             }
        }
        //到这一步 相同标签了 需要更新 标签属性，然后递归比较孩子
        let el = newVnode.el = oldVnode.el;
        updateProps(newVnode,oldVnode.data);
        let oldChildren=oldVnode.children ||[];
        let newChildren=newVnode.children ||[];
        //如果都有孩子
        if(oldChildren.length>0 && newChildren.length>0)
        {
            updateChildren(el,oldChildren,newChildren);

        }
        // 老的有孩子 新的没有 ，移除
        else if(oldChildren.children)
        {
             el.innerHtml='';
        }
        //新的有，旧的没有
        else if(newChildren.length){

            for(let i=0;i<newChildren.length>0;i++)
            {
                 let child=newChildren[i];
                 el.appendChild(createElement(child));
            }

        }

    }

}
/**
 * 判断是否是相同节点
 * 标签名和 key相同
 * @param {*} oldNode 
 * @param {*} newNode 
 */
function isSameNode(oldNode,newNode){
    return oldNode.tag===newNode.tag &&oldNode.key===newNode.key

}
/**
 * 更新比较子节点
 * @param {*} parent 
 * @param {*} oldChildren 
 * @param {*} newChildren 
 */

function updateChildren(parent,oldChildren,newChildren){

       let oldStartIndex=0,
           oldStartNode=oldChildren[oldStartIndex],
           oldEndIndex=oldChildren.length-1,
           oldEndNode=oldChildren[oldEndIndex],
           newStartIndex=0,
           newStartNode=newChildren[newStartIndex],
           newEndIndex=newChildren.length-1,
           newEndNode=oldChildren[newEndIndex],
           map=makeIndexByKey(oldChildren)
           ;
      
      //依次比较新老节点
      while(oldStartIndex<=oldEndIndex && newStartIndex<=newEndIndex){
        
         //如果头节点为空 指针后移
          if(!oldStartNode)
          {
              oldStartNode=oldChildren[++oldStartIndex];
          }
          //如果尾节点为空 指针前移

          if(!oldEndNode)
          {
               oldEndNode=oldChildren[--oldEndIndex];
          }

            // 比较头头，相同可以复用
          //适合 列表从尾部的增删 push pop
          //old：A,B,C,D new: A,B,C,D,E 前四个复用了 到比较到D结束 然后新增 E
          //old：A,B,C,D new: A,B,C 前四个复用了 到比较到C结束 然后删除D
        


          if(isSameNode(oldStartNode,newStartNode))
          {
             //更新属性，继续递归比较它的子节点
              patch(oldStartNode,newStartNode);
              //指针后移
              oldStartNode=oldChildren[++oldStartIndex];
              newStartNode=oldChildren[++newStartIndex];
          }
          // 比较尾尾
          //适合对节点从头部的增删，对应数组的 unshift shift
          else if(isSameNode(oldEndNode,newEndNode))
          {
                //更新属性，继续递归比较它的子节点
                patch(oldStartNode,newStartNode);
                //指针前移动
                oldEndNode=oldChildren[--oldEndIndex];
                newEndNode=oldChildren[--newEndIndex];
               
          }
          // 比较旧的头 和新的尾 （适合列表的倒序） 对应数组的 reverse
          else if(isSameNode(oldStartNode,newEndNode))
          {
              //更新属性，继续递归比较它的子节点
              patch(oldStartNode,newEndNode);
              //旧的指针后移
              oldStartNode=oldChildren[++oldStartIndex];
              //新的节点指针前移
              newEndNode=oldChildren[--newEndIndex];

          }
           // 比较旧的尾 和新的头 （适合列表的倒序） 对应数组的 reverse
           else if(isSameNode(oldEndNode,newStartNode))
           {
               //更新属性，继续递归比较它的子节点
               patch(oldEndNode,newStartNode);
               //旧的指针前移
               oldEndNode=oldChildren[--oldEndIndex];
               //新的节点指针后移
               newStartNode=oldChildren[++newStartIndex];
 
           }
           //以上四种是优化策略,对有规律的变化特殊处理
           //下面是就是乱序了
           //方案是：
           else {
               
                 let mapIndex=map[newStartNode];
                   //没有老的节点上发现
                 if(map===undefined)
                 {   //插入
                     parent.insertBefore(createElement(newStartNode),oldStartNode.el);
                 }
                 else{
                        //复用节点
                        patch(oldChildren[mapIndex],newStartNode);
                        //将旧节点上置为空
                        oldChildren[mapIndex]=null;
                        //指针后移
                        newStartNode=newChildren[++newStartIndex];
                 }

           }


      }
      //如果新的循环完毕但是老节点还有剩余
      if(oldStartIndex<=oldEndIndex)
      {
          for(let i=oldEndIndex;i<=oldEndIndex;i++)
          {
                let child=oldChildren[i];
                //如果不为空
                if(child)
                {
                    //移除
                   parent.removeChild(child.el);
                }
          }

      }
      //如果旧的循环完了，但是新的还有剩余，就得新增节点
      if(newStartIndex<=newEndIndex)
      {
        for(let i=newStartIndex;i<=newEndIndex;i++)
        {
            //获得插入的位置
            let ele= newChildren[newEndIndex + 1]?newChildren[newEndIndex + 1].el:null;
            parent.insertBefore(createElement(newChildren[newEndIndex]),ele);

        }
    }


}
/**
 * 获得 {key：index}的映射
 * @param {*} children 
 */
function makeIndexByKey(children){
    let map={};
    children.forEach((item,index)=>{
          map[item.key]=index;    
    })
    return map;

}

/**
 * 創建元素
 * @param {*} vnode 
 */

function createElement(vnode){
    let {tag,data,key,children,text}=vnode;
    if(typeof tag==='string')
    {
        vnode.el=document.createElement(tag);
        updateProps(vnode);
        children.forEach(child => {
            vnode.el.appendChild(createElement(child)); 
            
        });

    }
    else{
        vnode.el=document.createTextNode(text);

    }
    return vnode.el;

}

/**
 * jiu
 * @param {*} vnode 
 * @param {*} oldNode 
 */

function updateProps(vnode,oldProps={}){
    let {el,data}=vnode;
    for(let key in oldProps)
    {  
         //旧有新无 删除
         if(!data[key])
         {
             el.removeAttribute(key);
         }
    }
    el.style={};

    for(let key in data)
    {
        if(key==='style')
        {
            for(let styleName in data[key])
            {
                el.style[styleName]=data[key][styleName];
            }

        }
        else{
            el.setAttribute(key,data[key]);
        }

    }
    

}