<template>
    <div class="card">
        <div class="card-header">
            <h6>Подписание сформированного xml</h6>
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
                                <label>Тип xml</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <select class="form-select" id="xmltype" name="xmltype" v-model="xmltype">
                                    <option value="SendRequestRequest">SendRequestRequest</option>
                                    <option value="SendResponseRequest">SendResponseRequest</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Xml, в base64<br>[ содержимое soap > body ]</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="bdata" class="form-control" name="bdata" v-model="bdata" spellcheck="false" style="height: 250px;"></textarea>
                            </div>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <a class="btn btn-primary" @click.prevent="TextFormat" id="xml"><i class="fa fa-lg fa-indent"></i> Форматировать</a>&nbsp;
                                <a class="btn btn-primary" @click.prevent="TextMinimize" id="xmlmin"><i class="fa fa-lg fa-dedent"></i> Минимизировать</a> &nbsp; &nbsp;
                                <a class="btn btn-primary" @click.prevent="TextToBase64" id="tobase64"><i class="fa fa-lg fa-file-archive-o"></i> Текст в base64</a>&nbsp;
                                <a class="btn btn-primary" @click.prevent="Base64ToText" id="frombase64"><i class="fa fa-lg fa-file-text-o"></i> base64 в текст</a>
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>&nbsp;</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <a @click.prevent="SubmitForm" class="btn btn-primary me-1 mb-1">Подписать xml</a>
                                <JsonButton />
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>Результат</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="result" class="form-control" name="result" v-model="result" spellcheck="false" style="height: 250px;"></textarea>
                                <p style="padding-top:20px;"><a target="_blank" href="http://qs.cryptopro.ru/SVS/Verify/">Проверка подписанной xml</a></p>
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
    import Utils from '../helpers/Utils.js';
    import { Base64 } from 'js-base64';
    import { useStore } from '@/store';
    import { ref, reactive, onMounted } from 'vue';
    import JsonButton from '../components/JsonButton.vue';
    export default {
        setup() {
            const store = useStore();
            const bdata = ref();
            const xmltype = ref();
            const containers = reactive({value: []});
            const container = ref();
            const result = ref();
            const apiHelper = new ApiHelper(store.getBackendUrl);
            const utils = new Utils();

            onMounted(async () => {
                console.log('onMounted SignXml');
                store.updatePageHeader('Подписание xml');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
                xmltype.value = 'SendRequestRequest';
            })
            
            async function SubmitForm() {
                if (!bdata.value) {
                    result.value = 'Xml не указана!';
                    return;
                }

                let signObject = {
                    'request_type': 'sign_xml',
                    'data': bdata.value,
                    'sign_alias': container.value,
                    'options': {
                        'data_type': xmltype.value,
                        'sign_type': 'sign'
                    }
                };
                
                document.getElementById("json").innerHTML = JSON.stringify(signObject, undefined, 4);

                let response = await apiHelper.json('/sign', signObject);
                if (!response.error) {
                    result.value = Base64.decode(response.full_xml);
                } else {
                    result.value = response.error_description;
                }
            }

            function TextFormat() {
                if (bdata.value) bdata.value = utils.prettyXml(bdata.value);
            }
            function TextMinimize() {
                if (bdata.value) bdata.value = utils.xmlMin(bdata.value);
            }
            function TextToBase64() {
                if (bdata.value) bdata.value = Base64.encode(bdata.value);
            }
            function Base64ToText() {
                if (bdata.value) bdata.value = Base64.decode(bdata.value);
            }
            return {
                bdata, xmltype, result, container, containers,
                TextFormat, TextMinimize, TextToBase64, Base64ToText, SubmitForm
            }
        },
        components: {
            JsonButton
        }
    }
</script>