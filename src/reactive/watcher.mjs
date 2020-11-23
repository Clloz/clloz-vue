/*
 * @Author: Clloz
 * @Date: 2020-11-21 01:53:08
 * @LastEditTime: 2020-11-23 18:52:36
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /clloz-vue/src/reactive/watcher.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import Dep from './dep.mjs';

const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
function parsePath(path) {
    if (bailRE.test(path)) {
        return;
    }
    const segments = path.split('.');
    return function (obj) {
        for (let i = 0; i < segments.length; i += 1) {
            if (!obj) return;
            obj = obj[segments[i]];
        }
        return obj;
    };
}
export default class Watcher {
    constructor(gb, exp, cb) {
        this.gb = gb;
        this.data = this.gb.data;
        this.getter = parsePath(exp);
        this.cb = cb;
        this.value = this.get();
    }

    // 访问属性，添加订阅
    get() {
        Dep.target = this; // 设置 Dep.target 为当前 watcher，让 Dep 知道添加谁
        let value = this.getter.call(this.gb.data, this.gb.data);
        Dep.target = null; // getter 触发结束成功添加注册后设置 Dep.target 为 null，防止非 watcher 的属性访问也添加订阅
        return value;
    }

    addDep(dep) {
        dep.addSub(this); // 进行订阅
    }

    // 给 Dep 调用的更新方法
    update() {
        const oldVal = this.value;
        const newVal = this.get();
        // console.log(oldVal, newVal);
        // if (oldVal !== newVal) {
        this.cb.call(this.gb, newVal, oldVal);
        // }
    }
}
