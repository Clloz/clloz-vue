/*
 * @Author: Clloz
 * @Date: 2020-11-21 00:13:16
 * @LastEditTime: 2020-11-21 01:21:29
 * @LastEditors: Clloz
 * @Description: 用 proxy 实现的一个简单的数据绑定
 * @FilePath: /clloz-vue/src/reactive/simplify/index.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
let depCallbacks = new Map(); // 保存每个属性对应的依赖函数数组
let getUsedProps = []; // 收集依赖的数组
let nestObjCache = new Map(); // 处理对象的嵌套，Proxy 无法代理嵌套的对象中的属性

function depInject(callback) {
    getUsedProps = []; // 清空上次收集的依赖数据
    callback(); // 执行回调函数，获取其中依赖的数据

    // 将依赖数据和其对应的回调函数进行存储，在数据发生改变时执行回调函数
    for (let dep of getUsedProps) {
        if (!depCallbacks.has(dep[0])) {
            depCallbacks.set(dep[0], new Map());
        }
        if (!depCallbacks.get(dep[0]).has(dep[1])) {
            depCallbacks.get(dep[0]).set(dep[1], []);
        }
        depCallbacks.get(dep[0]).get(dep[1]).push(callback);
    }
}

// 将对象用 proxy 进行包装，对 set 和 get 进行代理
function reactive(object) {
    if (nestObjCache.has(object)) return nestObjCache.get(object);
    const proxy = new Proxy(object, {
        // set 时执行依赖的回调
        set(obj, prop, val) {
            obj[prop] = val;
            if (depCallbacks.has(obj) && depCallbacks.get(obj).has(prop)) {
                for (let callback of depCallbacks.get(obj).get(prop)) {
                    callback();
                }
            }
        },
        // get 时收集依赖
        get(obj, prop) {
            getUsedProps.push([obj, prop]);
            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop]);
            }
            return obj[prop];
        },
    });

    nestObjCache.set(object, proxy);
    return proxy;
}

// module.exports = {
//     depInject,
// };

let r = document.querySelector('#r');
let g = document.querySelector('#g');
let b = document.querySelector('#b');
let cDiv = document.querySelector('#color');
let rgb = {
    r: 0,
    g: 0,
    b: 0,
};
let p = reactive(rgb);
depInject(() => {
    cDiv.style.backgroundColor = `rgb(${p.r}, ${p.g}, ${p.b})`;
});
r.addEventListener('input', e => {
    console.log(e.target.value);
    p.r = e.target.value;
});
g.addEventListener('input', e => {
    p.g = e.target.value;
});
b.addEventListener('input', e => {
    p.b = e.target.value;
});
