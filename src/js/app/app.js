import $ from 'jquery';
import 'vendor/imgLiquid/imgLiquid';


/* 全頁偵測 resize Image */
let resizeImageTimer = null;
$('body').on('resizeImg', () => {
    clearTimeout(resizeImageTimer);
    resizeImageTimer = setTimeout(() => {
        $('.imgLiquidFill').imgLiquid();
    }, 50);
});