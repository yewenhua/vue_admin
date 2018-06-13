<template>
    <div>Agent</div>
</template>
<script>
    export default {
        data(){
            return {
                msg: 'OK',
                loading: false
            }
        },
        methods: {
            dd(){
                var that = this;
                that.loading = true;
                this.axios.get('/auth/refresh', {
                    params : {}
                })
                .then(function (response) {
                    that.$store.dispatch('refresh', {
                        token: response.data.token
                    });
                })
                .catch(function (error) {
                    console.log('111111111111')
                });
            }
        },
        mounted(){
            this.dd();
        }
    }
</script>
<style>

</style>