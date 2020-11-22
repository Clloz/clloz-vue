/*
 * @Author: Clloz
 * @Date: 2020-11-21 09:26:00
 * @LastEditTime: 2020-11-22 10:53:30
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /clloz-vue/src/reactive/observer.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import Dep from './dep.mjs';

export class Observer {
    constructor(data) {
        this.data = data;
        this.convert(data);
    }

    /* eslint-disable */
    // 改造 object 为可侦测的 object，用 Object.defineProperty 添加 getter 和 setter
    convert(obj) {
        Object.keys(obj).forEach(key => {
            let dep = new Dep();
            let val = obj[key];

            observe(val);
            Object.defineProperty(obj, key, {
                enumreable: true,
                configurable: true,
                get() {
                    // Dep.target 就是当前订阅的 Watcher，如果当前有订阅者，则告诉当前属性的 dep 实例
                    if (Dep.target) {
                        dep.depend();
                    }
                    return val;
                },
                set(newValue) {
                    if (val === newValue) return; // 如果属性没有变则没必要发布
                    val = newValue;
                    dep.notify(); // 通知当前属性的的 dep 属性变化，执行订阅者的 update
                },
            });
        });
    }
}

export function observe(val) {
    // 如果待观察的属性不是一个对象则直接返回
    if (!val || typeof val !== 'object') {
        return;
    }
    return new Observer(val);
}
