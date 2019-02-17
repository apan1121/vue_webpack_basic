import Vue from 'vue';
import app from './app';
import { mapActions, mapGetters } from 'vuex';

import {createStore} from 'lib/store/index';

const store = createStore([
    "common",
]);

import 'jquery';
import 'bootstrap';

let saveToLocalStorageTimer = null;

var Page = new Vue({
    el: '#appBox',
    data: function() {
        return {
            popstats: false,
        }
    },
    methods: {
        init: function(){

        },
    },
    watch: {

    },
    computed: {
        ...mapGetters([
        ])
    },
    mounted() {
        const that = this;
        that.init();
    },
    components: {
    },
    store,
});