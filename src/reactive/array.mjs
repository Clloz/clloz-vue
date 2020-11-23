/*
 * @Author: Clloz
 * @Date: 2020-11-23 17:05:01
 * @LastEditTime: 2020-11-23 18:57:08
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /clloz-vue/src/reactive/array.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    const original = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
        value(...args) {
            let result = original.apply(this, args);
            const ob = this.__ob__;
            let inserted;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }
            if (inserted) ob.observeArray(inserted);
            ob.dep.notify();
            return result;
        },
        enumerable: false,
        writable: true,
        configurable: true,
    });
});

export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}
