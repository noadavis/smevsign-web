<template>
    <div class="card">
        <div class="card-header">
            <h6>Подпись строки</h6>
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
                                <label>Строка</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <input type="text" class="form-control" id="string" name="string" v-model="string">
                            </div>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <div class="form-check">
                                    <div class="checkbox">
                                        <input type="checkbox" id="urlSafe" class="form-check-input" v-model="urlSafe">
                                        <label for="urlSafe">base64 url safe</label>
                                    </div>
                                </div>
                            </div>

                            <hr>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <a @click.prevent="SubmitForm" class="btn btn-primary me-1 mb-1">Подписать строку</a>
                                <JsonButton />
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="result" class="form-control" name="result" v-model="result" spellcheck="false" style="height: 100px;"></textarea>
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
    import { useStore } from '@/store';
    import { ref, reactive, onMounted } from 'vue';
    import JsonButton from '../components/JsonButton.vue';
    export default {
        setup() {
            const store = useStore();
            const string = ref();
            const containers = reactive({value: []});
            const container = ref();
            const result = ref();
            const urlSafe = ref(false);
            const apiHelper = new ApiHelper(store.getBackendUrl);

            onMounted(async () => {
                console.log('onMounted SignFile');
                store.updatePageHeader('Подпись строки');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
            })
            
            async function SubmitForm() {
                if (!string.value) {
                    result.value = 'Строка для подписи не указана!';
                    return;
                }
                let SignObject = {
                    'request_type': 'sign_string',
                    'sign_alias': container.value,
                    'data': Base64.encode(string.value)
                }
                if (urlSafe.value) {
                    SignObject['options'] = {
                        'url_safe': true
                    }
                }

                document.getElementById("json").innerHTML = JSON.stringify(SignObject, undefined, 4);

                let response = await apiHelper.json('/sign', SignObject);
                if (!response.error) {
                    result.value = response.value;
                } else {
                    result.value = response.error_description;
                }
            }
            return {
                string, result, container, containers, urlSafe,
                SubmitForm
            }
        },
        components: {
            JsonButton
        }
    }
</script>