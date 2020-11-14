import { Engine } from './engine';
var engine = new Engine();
window.onload = function () {
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
