const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配 {{}}

// let str='11{{33}}{{4}}44'
// console.log(defaultTagRE.exec(str))
// [ '{{33}}',匹配到元素
//   '33',   //匹配的结果
//   index: 2,
//   input: '11{{33}}{{4}}44',
//   groups: undefined ]
/**
 * 属性
 * @param {*} attrs 
 */
function genProps(attrs){
    let str='';
    for(let i=0;i<attrs.length;i++)
    {
        let attr=attrs[i];
        //目前暂时处理 style 特殊情况 例如 @click v-model 都得特殊处理
        // {
        //     name:'style',
        //     value:'color:red;border:1px'
        // }
        if(attr.name==='style')
        {
             let obj={};
             attr.value.split(';').forEach(element => {
                 let [key='',value='']= element.split(':');
                 obj[key]=value;

             });
             attr.value=obj;

           
        }
       
       str+=`${attr.name}:${JSON.stringify(attr.value)},`;

    }
    return `{${str.slice(0,-1)}}`;

}

function gen(el){
    //还是元素节点
    if(el.type==='1')
    {
         return generate(el);

    }
    else{
        let text=el.text;
        if(!text) return;
        //一次解析
       if(defaultTagRE.test(el.text))
        {
            defaultTagRE.lastIndex=0
            let lastIndex = 0, //上一次的匹配后的索引
            index=0,
            match=[],
            result=[];
          while(match=defaultTagRE.exec(text)){
              index=match.index;
              //先将 bb{{aa}} 中的 bb 添加
              result.push(`${JSON.stringify(text.slice(lastIndex,index))}`);
              //添加匹配的结果
              result.push(`_s(${match[1].trim()})`);
              lastIndex = index + match[0].length;
              console.log(lastIndex);

          }
          //例如：11{{sd}}{{sds}}23 此时 23还未添加
          if(lastIndex<text.length)
          {
              //result.push(`_v(${JSON.stringify(text.slice(lastIndex))})`);
              result.push(JSON.stringify(text.slice(lastIndex)));

          }
           console.log(result);
          //返回

           return `_v(${result.join('+')})`
  
      }
      //没有变量
       else{
          return `_v(${JSON.stringify(text)})`

       }
    }

}
/**
 * 解析子元素
 * @param {*} el 
 */

function genChildren(el){
    const {children}=el;
    if(children.length>0)
    {
        let resList=[];
        for(let i=0;i<children.length;i++)
        {
             let res=gen(children[i]);
             if(res) resList.push(res);
        }
        return resList.join(',')
    }
    return false;

}
// return _c('div',{class:'a'},_c('span',null,123,_v('hello')+_v(age))+_v(msg)))
//三部分 标签，属性，子
export function generate(el){
    let children = genChildren(el); // 生成孩子字符串
    let result = `_c("${el.tag}",${
            el.attrs.length? `${genProps(el.attrs)}`  : undefined
        }${
            children? `,${children}` :undefined
        })`;
   
    return result;
}
