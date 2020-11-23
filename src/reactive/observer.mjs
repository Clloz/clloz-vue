/*
 * @Author: Clloz
 * @Date: 2020-11-21 09:26:00
 * @LastEditTime: 2020-11-23 18:09:23
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /clloz-vue/src/reactive/observer.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import { arrayMethods, def } from './array.mjs';
import Dep from './dep.mjs';

export class Observer {
    constructor(data) {
        this.data = data;
        this.dep = new Dep();
        def(data, '__ob__', this);

        if (!Array.isArray(data)) {
            this.walk(data);
        } else {
            Object.setPrototypeOf(data, arrayMethods);
            this.observeArray(data);
        }
    }

    /* eslint-disable */
    // 改造 object 为可侦测的 object，用 Object.defineProperty 添加 getter 和 setter
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i += 1) {
            defineReactive(obj, keys[i]);
        }
    }

    observeArray(items) {
        for (let i = 0; i < items.length; i += 1) {
            observe(items[i]);
        }
    }
}

function defineReactive(obj, key) {
    let dep = new Dep();
    let val = obj[key];

    let childObj = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.depend();
                if (childObj) {
                    childObj.dep.depend();
                }
            }
            return val;
        },
        set(newVal) {
            if (val === newVal) return;
            val = newVal;
            dep.notify();
        },
    });
}

export function observe(val) {
    // 如果待观察的属性不是一个对象则直接返回
    if (!val || typeof val !== 'object') {
        return;
    }
    let ob;
    if (Object.hasOwnProperty.call(val, '__ob__') && val.__ob__ instanceof Observer) {
        ob = val.__ob__;
    } else {
        ob = new Observer(val);
    }
    return ob;
}
