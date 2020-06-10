/**
 * rollup 的配置文件
 */
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
    //入口
    input: './src/index.js',
    output: {
        format: 'umd', // 模块化类型
        file: 'dist/vue.js', 
        name: 'Vue', // 打包后的全局变量的名字
        sourcemap: true //源码映射
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' //忽略打包文件
        }),
        process.env.ENV === 'development'?serve({
            open: true,
            openPage: '/public/index.html',
            port: 8000,
            contentBase: ''
        }):null
    ]
}