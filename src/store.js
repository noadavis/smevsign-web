import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            backendUrl: 'http://127.0.0.1:8080/api/',
            pageHeader: '',
            updated: false
        }
    },
    mutations: {
        setSystemInfo(state, data) {
            state.backendUrl = data.backendUrl;
            state.updated = true
        },
        setPageHeader(state, value) {
            state.pageHeader = value;
        },
        setBackendUrl(state, value) {
            state.backendUrl = value;
        }
    },
    actions: {
        async updateSystemInfo({ commit }) {
            console.log('store/index updateSystemInfo');
            // let data = {
            //     'backendUrl': window.__env.api.backendUrl
            // };
            let data = {
                'backendUrl': 'http://127.0.0.1:8080/api/'
            };
            if ('backendUrl' in localStorage) {
                data.backendUrl = localStorage.getItem('backendUrl');
            } else {
                console.log('backendUrl not in localStorage');
            }
            commit('setSystemInfo', data);
        },
        async updatePageHeader({ commit }, value) {
            commit('setPageHeader', value);
        },
        async updateBackendUrl({ commit }, value) {
            commit('setBackendUrl', value);
        }
    },
    getters: {
        getBackendUrl(state) {
            return state.backendUrl;
        },
        getPageHeader(state) {
            return state.pageHeader;
        }
    }
})