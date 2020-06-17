
import {parseHTML} from './parser.js'
import {generate} from './generator.js'

export function compileToFunctions(template){
    //解析成 ast 树形元素
    let ast=parseHTML(template);
    let astStr=generate(ast);//_c("div",id:"app",_v(""),_c("div",class:"content",_v(_v("主页面"),_s(name),_v("e}}"),_s(age),_v(e}})),_v("")),_c("p",style:{"color":"red"},_v("静态节点"),_v("")))
    //转为
    //astStr='_c("div",{id:"app"},,_c("div",{class:"content"},_v(_v("主页面"),_s(name)),),_c("p",{style:{"color":"red"}},_v("静态节点"),))'
    let renderFnStr = `with(this){ \r\nreturn ${astStr} \r\n}`;
    console.log(astStr);
    let render=new Function(renderFnStr);
    console.log(render);
    //render();
    return render;




}