/*
 * @Author: Clloz
 * @Date: 2020-11-20 18:02:15
 * @LastEditTime: 2020-11-23 18:31:11
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
        skill: {
            language: 'japanese',
        },
        arr: [1, 2, 3, 4],
    },
};

observe(obj);

/* eslint-disable */
new Watcher(obj, 'arr.4', function () {
    console.log('reactive successful');
});

obj.data.arr.push(1);
// console.log(obj.data.arr);
// obj.data.arr[4].test = 'test';
// obj.data.skill.language = 'english';
// obj.data.arr = 'english';
// console.log(obj.data.arr);
