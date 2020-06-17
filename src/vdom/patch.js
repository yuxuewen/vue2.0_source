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
    }

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
 * 
 * @param {*} el 
 * @param {*} data 
 */

function updateProps(vnode){
    let {el,data}=vnode;
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