//              字母a-zA-Z_ - . 数组小写字母 大写字母  
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获   <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 闭合标签 </xxxxxxx>  
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// <div aa   =   "123"  bb=123  cc='123'
// 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
// <div >   <br/>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
// 匹配动态变量的  +? 尽可能少匹配 {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const ELEMENT_NDOE='1';
const TEXT_NODE='3'
export function parseHTML(html) {
    console.log(html)
    // ast 树 表示html的语法
    let root; // 树根 
    let currentParent;
    let elementStack = []; // 
    /**
     * ast 语法元素
     * @param {*} tagName 
     * @param {*} attrs 
     */
    
    function createASTElement(tagName,attrs){
        return {
            tag:tagName, //标签
            attrs,  //属性
            children:[], //子节点
            parent:null, //父节点
            type:ELEMENT_NDOE //节点类型
        }
    }
    // console.log(html)
    function start(tagName, attrs) { 
        //创建跟节点
        let element=createASTElement(tagName,attrs);
    
        if(!root)
        {
            root=element;
        }
        currentParent=element;//最新解析的元素
        elementStack.push(element); //元素入栈 //可以保证 后一个是的parent 是他的前一个
    }
    function end(tagName) {  // 结束标签
        //最后一个元素出栈 
        let element=elementStack.pop();
        let parent=elementStack[elementStack.length-1];
        //节点前后不一致，抛出异常
        if(element.tag!==tagName)
        {
            throw new TypeError(`html tag is error ${tagName}`);

        }
        console.log(parent)
        if(parent)
        {
            //子元素的parent 指向
            element.parent=parent;
            //将子元素添进去
            parent.children.push(element);

        }
       
    }
    /**
     * 解析到文本
     * @param {*} text 
     */
    function chars(text) { // 文本
        //解析到文本
        text=text.replace(/\s/g,'');
        //将文本加入到当前元素
        currentParent.children.push({
              type:TEXT_NODE,
              text
        })
        

      
    }
    // 根据 html 解析成树结构  </span></div>
    while (html) {
        //如果是html 标签
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            const startTageMatch = parseStartTag();

            if (startTageMatch) {
                // 开始标签
                start(startTageMatch.tagName,startTageMatch.attrs)
            }
            const endTagMatch = html.match(endTag);
            
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1])
            }
            // 结束标签 
        }

        // 如果不是0 说明是文本
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd); // 是文本就把文本内容进行截取
            chars(text);
        }
        if (text) {
            advance(text.length); // 删除文本内容
        }
    }

    function advance(n) {
        html = html.substring(n);
    }
    /**
     * 解析开始标签
     * <div id='app'> ={ tagName:'div',attrs:[{id:app}]}
     */

    function parseStartTag() {
        const start = html.match(startTagOpen); // 匹配开始标签
        if (start) {
            const match = {
                tagName: start[1], // 匹配到的标签名
                attrs: []
            }
            
            advance(start[0].length);
            let end, attr;
            //开始匹配属性 如果没有匹配到标签的闭合 并且比配到标签的 属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            };
            //匹配到闭合标签
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }

    return root;

}