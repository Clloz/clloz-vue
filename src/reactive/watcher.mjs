/*
 * @Author: Clloz
 * @Date: 2020-11-21 01:53:08
 * @LastEditTime: 2020-11-22 10:59:22
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /clloz-vue/src/reactive/watcher.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import Dep from './dep.mjs';

export default class Watcher {
    constructor(gb, exp, cb) {
        this.gb = gb;
        this.data = this.gb.data;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get();
    }

    // 访问属性，添加订阅
    get() {
        Dep.target = this; // 设置 Dep.target 为当前 watcher，让 Dep 知道添加谁
        let value = this.data[this.exp];
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
        if (oldVal !== newVal) {
            this.cb.call(this.gb, this.newVal, oldVal);
        }
    }
}
