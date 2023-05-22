import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
    state() {
        return {
            backendUrl: 'http://127.0.0.1:8080/api/',
            pageHeader: '',
            storagePath: '',
            updated: false
        }
    },
    actions: {
        async updateSystemInfo() {
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
            this.backendUrl = data.backendUrl;
            this.storagePath = data.storagePath;
            this.updated = true
        },
        async updatePageHeader(value) {
            this.pageHeader = value;
        },
        async updateBackendUrl(value) {
            this.backendUrl = value;
        },
        async updateStoragePath(value) {
            this.storagePath = value;
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
        },
        getUpdated(state) {
            return state.updated;
        }
    }
})