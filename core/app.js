/**
 * @file entry
 * @author skadyEyes(511767852@qq.com)
 */

import Vue from 'vue';
import Meta from 'vue-meta';

import {createRouter} from '@/.lavas/router';
import {createStore} from '@/.lavas/store';
import AppComponent from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(Meta);

Vue.config.productionTip = false;

export function createApp() {
    let router = createRouter();
    let store = createStore();
    let App = Vue.extend({
        router,
        store,
        ...AppComponent
    });
    return {App, router, store};
}

if (module.hot) {
    module.hot.accept();
}
