var LineChartConfig = require('line-chart/config-file.js');

module.exports = {
    getCanvasConfig: getCanvasConfig
};

function getCanvasConfig(target, propertie) {
    var config = undefined;
    if (target == 'line-chart') {
        config = LineChartConfig;
    }

    if (config == undefined) {
        console.error("no find target");
        return;
    }
    if (propertie == 'canvasData') {
        return config.getData();
    } else if (propertie == 'canvasOption') {
        return config.getOption();
    } else if (propertie == 'style') {
        return config.getStyle();
    } else {
        return config.get();
    }
}