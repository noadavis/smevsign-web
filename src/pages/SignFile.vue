<template>
    <div class="card">
        <div class="card-header">
            <h6>Подпись файлов</h6>
        </div>
        <div class="card-content">
            <div class="card-body">
                <form class="form form-horizontal">
                    <div class="form-body">
                        <div class="row">
                            
                            <div class="col-md-3">
                                <label>Подпись</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <select class="form-select" id="container" name="container" v-model="container">
                                    <option v-for="item in containers.value" v-bind:value="item.value" v-bind:key="item.key">
                                        {{ item.value }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <div class="form-check">
                                    <div class="checkbox">
                                        <input type="checkbox" id="detached" class="form-check-input" v-model="detached">
                                        <label v-if="detached" for="detached">Открепленная подпись</label>
                                        <label v-else for="detached">Прикрепленная подпись</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <div class="form-check">
                                    <div class="checkbox">
                                        <input type="checkbox" id="archive" class="form-check-input" v-model="archive">
                                        <label for="archive">Архивировать файлы, после подписания, в zip</label>
                                    </div>
                                </div>
                            </div>
                            <div v-if="archive" class="col-md-3">
                                <label>Имя архива</label>
                            </div>
                            <div v-if="archive" class="col-md-9 form-group">
                                <input type="text" class="form-control" id="archname" name="archname" v-model="archname">
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>Директория с файлами,<br>на сервере рядом с smevsign</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <input type="text" class="form-control" id="storage" name="storage" v-model="storage">
                                <div style="padding-top:7px;">
                                    <a href="#" title="Сохранить путь" class="btn btn-primary btn-sm" @click.prevent="saveStoragePath"><i class="fa fa-save"></i></a> &nbsp;
                                    <a href="#" title="Удалить путь" class="btn btn-danger btn-sm" @click.prevent="deleteStoragePath"><i class="fa fa-trash"></i></a>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label>Имена файлов в указанной директории,<br>по одному имени файла в строке</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="files" class="form-control" name="files" v-model="files" spellcheck="false" style="height: 250px;"></textarea>
                            </div>

                            <hr>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <a @click.prevent="SubmitForm" class="btn btn-primary me-1 mb-1">Подписать файлы</a>
                                <JsonButton />
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="result" class="form-control" name="result" v-model="result" spellcheck="false" style="height: 100px;"></textarea>
                                <p style="padding-top:20px;">Подпись формируется рядом с исходными файлами</p>
                                <p style="padding-top:5px;"><a target="_blank" href="https://crypto.kontur.ru/verify#">Проверка подписанных файлов</a></p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import ApiHelper from '../helpers/ApiHelper.js';
    import { Base64 } from 'js-base64';
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted } from 'vue'
    import JsonButton from '../components/JsonButton.vue'
    export default {
        setup() {
            const store = useStore();
            const storage = ref();
            const detached = ref(true);
            const archive = ref(true);
            const archname = ref('SignedContent.zip');
            const files = ref();
            const containers = reactive({value: []});
            const container = ref();
            const result = ref();
            const apiHelper = new ApiHelper(store.getters.getBackendUrl);

            onMounted(async () => {
                console.log('onMounted SignFile');
                store.dispatch('updatePageHeader', 'Подпись файлов');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
                console.log(store.getters.getStoragePath);
                storage.value = store.getters.getStoragePath;
            })
            
            async function SubmitForm() {
                if (!storage.value) {
                    result.value = 'Путь к файлам не указан!';
                    return;
                }
                let filesArray = [];
                if (files.value) {
                    for (const value of files.value.split('\n')) {
                        filesArray.push({
                            'file_path': storage.value, 
                            'file_name': value.trim()
                        });
                    }
                }
                if (filesArray.length == 0) {
                    result.value = 'Файлы не указаны!';
                    return;
                }
                let SignObject = {
                    'request_type': 'sign_file',
                    'sign_alias': container.value,
                    'options': {
                        'signature_detached': detached.value
                    },
                    'files': filesArray
                }
                if (archive.value) {
                    SignObject.options['zip_name'] = archname.value;
                }

                document.getElementById("json").innerHTML = JSON.stringify(SignObject, undefined, 4);

                let response = await apiHelper.json('/sign', SignObject);
                if (!response.error) {
                    result.value = Base64.decode(response.value);
                } else {
                    result.value = response.error_description;
                }
            }
            function saveStoragePath() {
                localStorage.setItem('storagePath', storage.value)
                store.dispatch('updateStoragePath', storage.value);
            }
            function deleteStoragePath() {
                localStorage.removeItem('storagePath');
                store.dispatch('updateStoragePath', '');
                storage.value = '';
            }
            return {
                storage, detached, archive, archname, files, result, container, containers, //error,
                SubmitForm, saveStoragePath, deleteStoragePath
            }
        },
        components: {
            JsonButton
        }
    }
</script>