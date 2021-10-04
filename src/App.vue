<template>
    <div id="main" class="layout-horizontal">
        <header class="mb-4">
            <HeaderLogo></HeaderLogo>
            <HeaderMenu></HeaderMenu>
        </header>

        <div v-if="$store.state.updated" class="content-wrapper container">
            <div class="page-heading"><h3>{{$store.getters.getPageHeader}}</h3></div>
            <div class="page-content">
                <section class="row">
                    
                    <div class="col-12 col-lg-12">
                        <router-view />
                    </div>

                </section>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from './components/Footer.vue'
    import HeaderLogo from './components/HeaderLogo.vue'
    import HeaderMenu from './components/HeaderMenu.vue'
    import { onBeforeMount } from 'vue'
    import { useStore } from 'vuex'
    export default {
        setup() {
            const store = useStore();
            onBeforeMount(() => {
                console.log('App onBeforeMount');
                store.dispatch('updateSystemInfo');
            })
        },
        components: {
            Footer, HeaderLogo, HeaderMenu
        }
    }
</script>

