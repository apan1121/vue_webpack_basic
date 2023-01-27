import { createApp, defineAsyncComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import './app.js';
import { createRoutes } from 'router';
import { createStores } from 'lib/store/index';


const store = createStores([
    'common',
]);
const router = createRoutes(store);

const app = createApp({
    components: {
        MainPage: defineAsyncComponent(() => import('components/MainPage/main.vue')),
    },
    filters: {},
    data(){
        return {
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
    },
    created(){
    },
    mounted(){
        const that = this;
        that.int();
    },
    methods: {
        int(){
        },
        ...mapActions([]),
        ...mapMutations([]),
    },
    store,
});

app.use(store);
app.use(router);
app.mount('#appBox');