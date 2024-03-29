import jsVars from './jsVars';
import mixpanel from './mixpanel';

/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-param-reassign */
const main = {
    default: {
    },
    setDefault(data){
        this.default = {
            ...this.default,
            ...data,
        };
    },
    fbq(action, event, data){
        if (!data) {
            data = {};
        }

        data = {
            ...this.default,
            ...data,
        };
        // console.log('fbq', action, event, data);
        if (!!window.fbq) {
            if (!!data) {
                window.fbq(action, event, data);
            } else {
                window.fbq(action, event);
            }
        }
    },
    gtag(action, event, data){
        if (!data) {
            data = {};
        }

        data = {
            ...this.default,
            ...data,
        };
        if (!!window.gtag) {
            if (!!data) {
                window.gtag(action, event, data);
            } else {
                window.gtag(action, event);
            }
        }
    },
    mixpanel(action, data){
        if (!data) {
            data = {};
        }

        data = {
            ...this.default,
            ...data,
        };
        if (!!window.mixpanel) {
            mixpanel.track(action, data);
        }
    },
};

export default main;