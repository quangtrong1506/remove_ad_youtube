let time = 0;
let currentId = null;
let isJustStartedPlayingVideo = true;
let isLoading = false;
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
    } else if (!isLoading) {
        time = Math.floor(document.querySelector('video')?.currentTime) || 0;
    }
}, 100);
const handleAdvertisement = (type) => {
    console.log('Ads: ', type);
    switch (type) {
        case typeOfAdvertisement.beforePlayingTheVideo:
            let id = window.location.href.split('?v=')[1]?.split('&')[0];
            if (id && !isLoading) {
                window.location = `https://youtu.be/${id}`;
                isLoading = true;
            }
            break;

        case typeOfAdvertisement.middleOfTheVideo:
            if (currentId && !isLoading) {
                window.location = `https://youtu.be/${currentId}?t=${time}`;
                isLoading = true;
            }
            break;

        case typeOfAdvertisement.adsCanBeSkipped:
            document.querySelector('.ytp-ad-skip-button-modern.ytp-button')?.click();
            break;

        default:
            console.log('Ads undefined!');
            break;
    }
};
navigation.addEventListener('navigate', () => {
    isLoading = false;
    let id = window.location.href.split('?v=')[1]?.split('&')[0];
    let t = window.location.href.split('?v=')[1]?.split('&')[1];
    if (id && !t) {
        currentId = id;
        isJustStartedPlayingVideo = true;
        setTimeout(() => {
            isJustStartedPlayingVideo = false;
        }, 5000);
        time = 0;
    }
});
