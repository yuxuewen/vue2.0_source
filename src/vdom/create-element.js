/**
 * 创建节点
 * @param {*} param0 
 */
export function createElement(tag,data={},...children){
   
    return  vNode(tag,data,data.key,children,undefined);

}
/**
 * 文本节点
 * @param {*} text 
 */
export function createNodeText(text){
    
    console.log(text);
    return vNode(undefined,undefined,undefined,undefined,text)

}
/**
 * 虚拟节点
 */
function vNode(tag,data,key,children,text){
      return {
           tag,
           data,
           key,
           children,
           text

      }
}