let time = 0;
let currentId = null;
let isJustStartedPlayingVideo = true;
const typeOfAdvertisement = {
    beforePlayingTheVideo: Symbol('before_playing_the_video'),
    middleOfTheVideo: Symbol('middle_of_the_video'),
    adsCanBeSkipped: Symbol('ads_can_be_skipped'),
};
setInterval(() => {
    if (document.querySelector('.ytp-ad-skip-button-modern.ytp-button'))
        handleAdvertisement(typeOfAdvertisement.adsCanBeSkipped);
    else if (document.querySelector('.ytp-ad-text.ytp-ad-preview-text-modern')) {
        if (isJustStartedPlayingVideo)
            handleAdvertisement(typeOfAdvertisement.beforePlayingTheVideo);
        else handleAdvertisement(typeOfAdvertisement.middleOfTheVideo);
    } else {
        time = Math.floor(document.querySelector('video')?.currentTime) || 0;
    }
}, 100);
const handleAdvertisement = (type) => {
    console.log('Ads: ', type);
    switch (type) {
        case typeOfAdvertisement.beforePlayingTheVideo:
            if (currentId) window.location.href = `https://youtu.be/${currentId}`;
            break;

        case typeOfAdvertisement.middleOfTheVideo:
            if (currentId) window.location.href = `https://youtu.be/${currentId}&t=${time}s`;
            break;

        case typeOfAdvertisement.adsCanBeSkipped:
            document.querySelector('.ytp-ad-skip-button-modern.ytp-button')?.click();
            break;

        default: {
            console.log('Ads undefined!');
            break;
        }
    }
};
navigation.addEventListener('navigate', () => {
    let id = window.location.href.split('?v=')[1]?.split('&')[0];
    if (id) {
        currentId = id;
        isJustStartedPlayingVideo = true;
        setTimeout(() => {
            isJustStartedPlayingVideo = false;
        }, 5000);
        time = 0;
    } else {
        isJustStartedPlayingVideo = false;
    }
});
