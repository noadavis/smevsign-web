import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            backendUrl: 'http://127.0.0.1:8080/api/',
            pageHeader: '',
            storagePath: '',
            updated: false
        }
    },
    mutations: {
        setSystemInfo(state, data) {
            state.backendUrl = data.backendUrl;
            state.storagePath = data.storagePath;
            state.updated = true
        },
        setPageHeader(state, value) {
            state.pageHeader = value;
        },
        setBackendUrl(state, value) {
            state.backendUrl = value;
        },
        setStoragePath(state, value) {
            state.storagePath = value;
        },
    },
    actions: {
        async updateSystemInfo({ commit }) {
            console.log('store/index updateSystemInfo');
            let data = {
                'backendUrl': 'http://127.0.0.1:8080/api/',
                'storagePath': ''
            };
            if ('backendUrl' in localStorage) {
                data.backendUrl = localStorage.getItem('backendUrl');
            } else {
                console.log('backendUrl not in localStorage');
            }
            if ('storagePath' in localStorage) {
                data.storagePath = localStorage.getItem('storagePath');
            }
            commit('setSystemInfo', data);
        },
        async updatePageHeader({ commit }, value) {
            commit('setPageHeader', value);
        },
        async updateBackendUrl({ commit }, value) {
            commit('setBackendUrl', value);
        },
        async updateStoragePath({ commit }, value) {
            commit('setStoragePath', value);
        }
    },
    getters: {
        getBackendUrl(state) {
            return state.backendUrl;
        },
        getStoragePath(state) {
            return state.storagePath;
        },
        getPageHeader(state) {
            return state.pageHeader;
        }
    }
})