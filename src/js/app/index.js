import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { createStore } from 'lib/store/index';
import router from 'router';
import app from './app';

import 'jquery';
import 'bootstrap';

// import UnitTab from '../components/UnitTab/main.vue';

const store = createStore([
    'common',
]);

const Page = new Vue({
    el: '#appBox',
    components: {
        MainPage: () => import('components/MainPage/main.vue'),
        // UnitTab,
    },
    data(){
        return {
            input: 'here',
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {

    },
    mounted(){
    },
    methods: {
        init(){
        },
    },
    store,
    router,
});