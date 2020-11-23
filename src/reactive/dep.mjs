/*
 * @Author: Clloz
 * @Date: 2020-11-21 01:52:59
 * @LastEditTime: 2020-11-23 17:38:56
 * @LastEditors: Clloz
 * @Description: 依赖管理中心
 * @FilePath: /clloz-vue/src/reactive/dep.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
function remove(arr, item) {
    if (arr.length) {
        let index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
    return false;
}

export default class Dep {
    constructor() {
        this.subs = [];
    }

    // 调用订阅者 Watcher 的 addDep 方法添加订阅，实际内部调用的就是下面的 addSub
    depend() {
        Dep.target.addDep(this);
    }

    // 添加订阅
    addSub(sub) {
        this.subs.push(sub);
    }

    // 移除订阅
    removeSub(sub) {
        remove(this.subs, sub);
    }

    // 接收到来自 setter 的属性变化的消息则执行所有订阅者的 update 方法
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

Dep.target = null;
