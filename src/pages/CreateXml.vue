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
                                <label>Тип xml</label>
                            </div>
                            <div class="col-md-9 form-group">
                                <select class="form-select" id="xmltype" name="xmltype" v-model="xmltype">
                                    <option value="SendRequestRequest">SendRequestRequest</option>
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
                                <div class="form-check">
                                    <div class="checkbox">
                                        <input @change="updateUserCertificates" type="checkbox" id="usepersonal" class="form-check-input" v-model="usepersonal">
                                        <label for="usepersonal">Подписать бизнес данные пользовательской подписью</label>
                                    </div>
                                </div>
                            </div>
                            <div v-if="usepersonal" class="formRow">
                                <div class="col-md-3">
                                    <label>Пользовательская подпись</label>
                                </div>
                                <div class="col-md-9 form-group">
                                    <select class="form-select" id="personal" name="personal" v-model="personal">
                                        <option v-for="item in personalCertificates.value" v-bind:value="item.id" v-bind:key="item.id">
                                            {{ item.value }}
                                        </option>
                                    </select>
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
    require("../helpers/cadesplugin_api.js");
    import CryptoHelper from '../helpers/CryptoHelper.js'

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
            const xmltype = ref();
            const personalCertificates = reactive({value: []});
            const personal = ref();
            const usepersonal = ref();
            const containers = reactive({value: []});
            const container = ref();
            const smevscheme = reactive({value: [{"key":"1","value":"1.1"},{"key":"2","value":"1.2"},{"key":"3","value":"1.3"}]});
            const scheme = ref();
            const uuid = ref();
            const result = ref();
            const apiHelper = new ApiHelper(store.getters.getBackendUrl);
            const utils = new Utils();
            const cryptoHelper = new CryptoHelper();
            const smevsignAlgorithmNames = {
                "ГОСТ Р 34.10-2012 256 бит": "GOST3410_2012_256",
                "ГОСТ Р 34.10-2012 512 бит": "GOST3410_2012_512",
            }
            
            onMounted(async () => {
                console.log('onMounted CreateXml');
                store.dispatch('updatePageHeader', 'Создание xml');
                let response = await apiHelper.get('containers')
                containers.value = response;
                if (containers.value.length > 0) {
                    container.value = containers.value[0].value;
                }
                scheme.value = smevscheme.value[0].value;
                xmltype.value = 'SendRequestRequest';
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

                // готовим объект для создания xml
                let signObject = {
                    'request_type': 'sign_xml',
                    'data': bdata.value,
                    'sign_alias': container.value,
                    'options': {
                        'data_type': xmltype.value,
                        'sign_type': 'create',
                        'uuid': uuid.value,
                        'xml_scheme': scheme.value
                    }
                };

                if (usepersonal.value) {
                    // получаем расчет digest для нормализованного узла <SignedInfo>
                    // в котором находится digest нормализованного содержимого MessagePrimaryContent
                    // getnormalizedDigests возвращает 2 digest значения:
                    // signedInfoDigest - значение которое необходимо подписать
                    // digest - значение которое необходимо передать обратно для создания xml
                    let normalizedDigests = await getnormalizedDigests();
                    if (Object.keys(normalizedDigests).length == 0) {
                        result.value = 'digest для подписи не получен';
                        return;
                    }
                    // sha1 отпечаток и алгоритм выбранной пользовательской подписи
                    let selectedThumbprint = personalCertificates.value[personal.value].thumbprint;
                    let selectedAlgorithm = personalCertificates.value[personal.value].algorithm;
                    // преобразуем signedInfoDigest: из base64 в hex
                    let digestString = utils.base64Decode(normalizedDigests[selectedAlgorithm].signedInfoDigest);
                    let digestHex = utils.stringToHex(digestString);
                    
                    // подписываем hex значение signedInfoDigest пользовательской подписью
                    const signature = await cryptoHelper.signSignedInfoDigest(
                        selectedThumbprint, 
                        selectedAlgorithm,
                        digestHex
                    );
                    // преобразуем из hex в base64
                    let signatureString = utils.hexToString(signature.hex);
                    let signatureReversed = utils.reverse(signatureString);
                    let signatureBase64 = utils.base64Encode(signatureReversed);

                    signObject['personal_sign'] =  {
                        'digest_value': normalizedDigests[selectedAlgorithm].digest,
                        'certificate': signature.cert,
                        'algorithm': selectedAlgorithm,
                        'signature_value': signatureBase64
                    }
                }

                // console.log(signObject);

                let response = await apiHelper.json('/sign', signObject);
                if (!response.error) {
                    result.value = Base64.decode(response.full_xml);
                } else {
                    result.value = response.error_description;
                }
            }

            async function getnormalizedDigests() {
                let normalizedDigests = {};
                let digests = await apiHelper.json('/sign', {
                    'request_type': 'sign_xml',
                    'data': bdata.value,
                    'options': {
                        'sign_type': 'digest'
                    }
                })
                // console.log(digests);
                if (!digests.error) {
                    for (const normalizedDigest of digests.digest) {
                        normalizedDigests[normalizedDigest.algorithm] = {
                            'digest': normalizedDigest.value,
                            'signedInfoDigest': normalizedDigest.signed_info
                        }
                    }
                } else {
                    result.value = digests.error_description;
                }
                // console.log(normalizedDigests);
                return normalizedDigests;
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
            async function updateUserCertificates() {
                if (usepersonal.value) {
                    personalCertificates.value = [];
                    let certificates = await cryptoHelper.getUserCertificates('34.10-2012');
                    // console.log(certificates);
                    let index = 0;
                    for (const cert of certificates) {
                        personalCertificates.value.push({
                            "id": index,
                            "thumbprint": cert.thumbprint,
                            "value": cert.subject + ' / ' + cert.validTo,
                            "algorithm": smevsignAlgorithmNames[cert.algorithm]
                        })
                        index++;
                    }
                    // console.log(personalCertificates.value);
                    if (personalCertificates.value.length > 0) {
                        personal.value = personalCertificates.value[0].id;
                    }
                }
            }
            return {
                bdata, xmltype, smevscheme, scheme, uuid, result, 
                container, containers, usepersonal, personal, personalCertificates,
                TextFormat, TextMinimize, TextToBase64, Base64ToText, SubmitForm, GenerateUuid, updateUserCertificates
            }
        }
    }
</script>

<style>

</style>