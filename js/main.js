setInterval(() => {
    const a = [
        document.querySelector('.ytp-ad-skip-button-modern.ytp-button'),
        document.querySelector('ytp-ad-text.ytp-ad-preview-text-modern'),
        document.querySelector('.ytp-ad-player-overlay-skip-or-preview'),
        document.querySelector('.ytp-ad-simple-ad-badge .ytp-ad-text'),
    ];
    a[0] && a[0].click();
    if (a[1] || a[2] || (a[3] && a[3].innerText.slice(0, 3) === '1/2')) window.location.reload();
}, 100);
