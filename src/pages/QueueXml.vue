<template>
    <div class="card">
        <div class="card-header">
            <h6>Xml опроса очереди и подтверждение получения</h6>
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
                                <label>Xml</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <select @change="xmlChange" class="form-select" id="xml" name="xml" v-model="xml">
                                    <option v-for="item in xmltype.value" v-bind:value="item.value" v-bind:key="item.key">
                                        {{ item.value }}
                                    </option>
                                </select>
                            </div>
                            <div v-if="isAck" class="formRow">
                                <div class="col-md-3">
                                    <label>MessageId, uuid.v1</label>
                                    <div style="float: right; padding-right: 20px;">
                                        <a @click.prevent="GenerateUuid" class="btn btn-info btn-sm me-1 mb-1"><i class="fa fa-lg fa-gear"></i></a>
                                    </div>
                                </div>
                                <div class="col-md-9 form-group" style="padding-left: 5px;">
                                    <input type="text" class="form-control" id="uuid" name="uuid" v-model="uuid">
                                </div>
                            </div>
                            <div v-else class="formRow">
                                <div class="col-md-3">
                                    <label>Опрос очереди по ВС: RootElement</label>
                                </div>
                                <div class="col-md-9 form-group" style="padding-left: 5px;">
                                    <input type="text" class="form-control" id="rootelement" name="rootelement" v-model="rootelement">
                                </div>
                                <div class="col-md-3">
                                    <label>Опрос очереди по ВС: Namespace</label>
                                </div>
                                <div class="col-md-9 form-group" style="padding-left: 5px;">
                                    <input type="text" class="form-control" id="namespace" name="namespace" v-model="namespace">
                                </div>
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
    import { v1 as uuidv1 } from 'uuid';
    import { Base64 } from 'js-base64';
    import { useStore } from 'vuex'
    import { ref, reactive, onMounted } from 'vue'
    export default {
        setup() {
            const store = useStore();
            const containers = reactive({value: []});
            const container = ref();
            const smevscheme = reactive({value: [{"key":"1","value":"1.1"},{"key":"2","value":"1.2"},{"key":"3","value":"1.3"}]});
            const scheme = ref();
            const xmltype = reactive({value: [{"key":"1","value":"GetRequestRequest"},{"key":"2","value":"GetResponseRequest"},{"key":"3","value":"AckRequest"}]});
            const xml = ref();
            const uuid = ref();
            const rootelement = ref();
            const namespace = ref();
            const isAck = ref(false);
            const result = ref();
            const apiHelper = new ApiHelper(store.getters.getBackendUrl);
            
            onMounted(async () => {
                console.log('onMounted QueueXml');
                store.dispatch('updatePageHeader', 'QueueXml');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
                scheme.value = smevscheme.value[0].value;
                xml.value = xmltype.value[0].value;
            })
            
            async function SubmitForm() {
                let request_type = 'queue_xml';
                if (xml.value == 'AckRequest') {
                    request_type = 'ack_xml';
                    if (!uuid.value) {
                        result.value = 'MessageId не указан!';
                        return;
                    }
                }
                let request = {
                    'request_type': request_type,
                    'sign_alias': container.value,
                    'options': {
                        'data_type': xml.value,
                        'uuid': uuid.value,
                        'xml_scheme': scheme.value
                    }
                }
                if (rootelement.value && namespace.value) {
                    request.options.root_element = rootelement.value;
                    request.options.namespace = namespace.value;
                }
                let response = await apiHelper.json('/sign', request)
                if (!response.error) {
                    result.value = Base64.decode(response.full_xml);
                } else {
                    result.value = response.error_description;
                }
            }
            function GenerateUuid() {
                uuid.value = uuidv1();
            }
            function xmlChange() {
                isAck.value = xml.value == 'AckRequest';
            }
            return {
                containers, container, smevscheme, scheme, uuid, result, xmltype, xml, rootelement, namespace, 
                SubmitForm, GenerateUuid, isAck, xmlChange
            }
        }
    }
</script>

<style>

</style>