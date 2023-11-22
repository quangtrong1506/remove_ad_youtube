console.log('Connected');
setInterval(() => {
    //TODO: auto bỏ qua quảng cáo
    if (document.querySelector('.ytp-ad-skip-button-modern.ytp-button')) {
        console.log('[1]');
        document.querySelector('.ytp-ad-skip-button-modern.ytp-button').click();
    }
    if (
        document.querySelector('ytp-ad-text.ytp-ad-preview-text-modern') ||
        document.querySelector('.ytp-ad-player-overlay-skip-or-preview')
    ) {
        console.log('[2]');
        window.location.reload();
    }
    if (document.querySelector('.ytp-ad-simple-ad-badge .ytp-ad-text')) {
        if (
            document.querySelector('.ytp-ad-simple-ad-badge .ytp-ad-text').innerText.slice(0, 3) ===
            '1/2'
        ) {
            console.log('[3]');
            window.location.reload();
        }
    }
}, 100);
//ytp-ad-text ytp-ad-preview-text-modern
//ytp-ad-simple-ad-badge
//ytp-ad-text
