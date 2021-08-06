<template>
    <div class="vue-webpack-basic">
        <router-link class="nav-link" :to="{ name: 'A'}">
            <span>A</span>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'B'}">
            <span>B</span>
        </router-link>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { detectAnyAdblocker } from 'just-detect-adblock';


const pc_min_size = 567;
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {},
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
        ]),
        route(){
            return this.$route;
        },
    },
    watch: {
    },
    created(){},
    mounted(){
        this.init();
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            SetPageSetting: 'SetPageSetting',
            CheckAdBlock: 'CheckAdBlock',
        }),
        init(){
            const that = this;
            $(window).bind('resize', () => {
                clearTimeout(that.windowResizeTimer);
                that.windowResizeTimer = setTimeout(() => {
                    let mode_type = 'pc';
                    const width = $('body').width();
                    if (width < pc_min_size) {
                        mode_type = 'mobile';
                    }
                    that.SetPageSetting({ mode_type, width });
                }, 100);
            }).trigger('resize');

            /* 偵測 adblocker */
            detectAnyAdblocker().then((detected) => {
                that.CheckAdBlock(detected);
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>