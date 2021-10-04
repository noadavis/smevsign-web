<template>
    <div class="card">
        <div class="card-header">
            <h6>Создание и подпись xml по бизнес данным</h6>
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
                                <label>Схема СМЭВ3</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <select class="form-select" id="scheme" name="scheme" v-model="scheme">
                                    <option v-for="item in smevscheme.value" v-bind:value="item.value" v-bind:key="item.key">
                                        {{ item.value }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>MessageId, uuid.v1</label>
                                <div style="float: right;">
                                    <a @click.prevent="GenerateUuid" class="btn btn-info btn-sm me-1 mb-1"><i class="fa fa-lg fa-gear"></i></a>
                                </div>
                            </div>
                            <div class="col-md-9 form-group">
                                <input type="text" class="form-control" id="uuid" name="uuid" v-model="uuid">
                            </div>
                            <div class="col-md-3">
                                <label>Бизнес данные, в base64</label>
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
                                <a @click.prevent="SubmitForm" class="btn btn-primary me-1 mb-1">Создать xml</a>
                            </div>
                            <hr>
                            <div class="col-md-3">
                                <label>Результат</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <textarea id="result" class="form-control" name="result" v-model="result" spellcheck="false" style="height: 250px;"></textarea>
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
    import { v1 as uuidv1 } from 'uuid';
    import { Base64 } from 'js-base64';
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted } from 'vue'
    export default {
        setup() {
            const store = useStore();
            const bdata = ref();
            const containers = reactive({value: []});
            const container = ref();
            const smevscheme = reactive({value: [{"key":"1","value":"1.1"},{"key":"2","value":"1.2"},{"key":"3","value":"1.3"}]});
            const scheme = ref();
            const uuid = ref();
            const result = ref();
            const personalsign = ref();
            const apiHelper = new ApiHelper(store.getters.getBackendUrl);
            const utils = new Utils();
            
            onMounted(async () => {
                console.log('onMounted SignForm');
                store.dispatch('updatePageHeader', 'CreateXml');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
                scheme.value = smevscheme.value[0].value;
            })
            
            async function SubmitForm() {
                if (!bdata.value) {
                    result.value = 'Бизнес данные пусты!';
                    return;
                }
                if (!uuid.value) {
                    result.value = 'MessageId не указан!';
                    return;
                }
                let response = await apiHelper.json('/sign', {
                    'request_type': 'sign_xml',
                    'data': bdata.value,
                    'sign_alias': container.value,
                    'options': {
                        'data_type': 'SendRequestRequest',
                        'sign_type': 'create',
                        'uuid': uuid.value,
                        'xml_scheme': scheme.value
                    }
                })
                if (!response.error) {
                    result.value = Base64.decode(response.full_xml);
                } else {
                    result.value = response.error_description;
                }
            }
            function GenerateUuid() {
                uuid.value = uuidv1();
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
                bdata, containers, container, personalsign, smevscheme, scheme, uuid, result, 
                TextFormat, TextMinimize, TextToBase64, Base64ToText, SubmitForm, GenerateUuid
            }
        }
    }
</script>

<style>

</style>