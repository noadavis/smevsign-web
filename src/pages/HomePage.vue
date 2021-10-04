<template>
    <div class="card">
        <div class="card-header">
            <h6>smevsign-web: демонстрация возможностей rest api smevsign</h6>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Для начала работы укажите адрес tomcat с smevsign</p>
                <div class="form-group row align-items-center">
                    <div class="col-lg-2 col-2">
                        <label class="col-form-label">backendUrl</label>
                    </div>
                    <div class="col-lg-8 col-8">
                        <input type="text" id="backUrl" class="form-control" v-model="backUrl">
                    </div>
                    <div class="col-lg-2 col-2">
                        <a href="#" title="Сохранить" class="btn btn-primary btn-sm" @click.prevent="saveBackendUrl"><i class="fa fa-save"></i></a> &nbsp;
                        <a href="#" title="Удалить" class="btn btn-danger btn-sm" @click.prevent="deleteBackendUrl"><i class="fa fa-trash"></i></a>
                    </div>
                </div>
                <hr>
                <p><i class="fa fa-github"></i> <a target="_blank" href="https://github.com/noadavis/smevsign">smevsign: rest api система подписания</a></p>
                <p>git clone https://github.com/noadavis/smevsign.git</p>
                <p><i class="fa fa-github"></i> <a target="_blank" href="https://github.com/noadavis/smevsign-web">smevsign-web: web интерфейс для smevsign</a></p>
                <p>git clone https://github.com/noadavis/smevsign-web.git</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { useStore } from 'vuex'
    import { onMounted, ref } from 'vue'
    export default {
        setup() {
            const backUrl = ref();
            const store = useStore();
            onMounted(async () => {
                store.dispatch('updatePageHeader', 'Home');
                backUrl.value = store.getters.getBackendUrl;
            })
            function saveBackendUrl() {
                localStorage.setItem('backendUrl', backUrl.value)
                store.dispatch('updateBackendUrl', backUrl.value);
            }
            function deleteBackendUrl() {
                localStorage.removeItem('backendUrl');
                store.dispatch('updateBackendUrl', 'http://127.0.0.1:8080/api/');
                backUrl.value = 'http://127.0.0.1:8080/api/';
            }
            return {
                saveBackendUrl, deleteBackendUrl, backUrl
            }
        }
    }
</script>