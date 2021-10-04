module.exports = {
    chainWebpack: config => {
        config.plugin("copy").tap(([pathConfigs]) => {
            pathConfigs.unshift({
                from: "config",
                to: "config"
            });
            return [pathConfigs]
        })
    },
    transpileDependencies: ["vuetify"],
    publicPath: ''
};