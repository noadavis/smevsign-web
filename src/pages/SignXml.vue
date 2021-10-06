<template>
    <div class="card">
        <div class="card-header">
            <h6>Переподписание сформированного xml</h6>
        </div>
        <div class="card-content">
            <div class="card-body">
                <p>Sign xml</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { useStore } from 'vuex'
    import { onMounted } from 'vue'
    export default {
        setup() {
            const store = useStore();
            onMounted(async () => {
                store.dispatch('updatePageHeader', 'Подписание xml');
            })
        }
    }
</script>