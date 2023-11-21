console.log('Connected');
setInterval(() => {
    //TODO: auto bỏ qua quảng cáo
    if (document.querySelector('.ytp-ad-skip-button-modern.ytp-button')) {
        console.log('[1]');
        document.querySelector('.ytp-ad-skip-button-modern.ytp-button').click();
    }
    if (document.querySelector('ytp-ad-text.ytp-ad-preview-text-modern')) {
        console.log('[2]');
        window.location.reload();
    }
}, 100);
//ytp-ad-text ytp-ad-preview-text-modern
