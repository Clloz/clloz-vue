/*
 * @Author: Clloz
 * @Date: 2020-11-20 18:02:15
 * @LastEditTime: 2020-11-22 02:18:13
 * @LastEditors: Clloz
 * @Description: a simulate implemention of vue3 reactive, interactive data binding
 * @FilePath: /clloz-vue/src/reactive/index.mjs
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import Watcher from './watcher.mjs';
import { observe } from './observer.mjs';

let obj = {
    data: {
        name: 'clloz',
        age: '28',
    },
};

observe(obj);

/* eslint-disable */
new Watcher(obj, 'name', function () {
    console.log('reactive successful');
});

obj.data.name = 'clloz1992';
console.log(obj.data.name);
