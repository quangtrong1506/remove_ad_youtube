let time = 0;
let currentId = null;
let isJustStartedPlayingVideo = true;
let isLoading = false;
const typeOfAdvertisement = {
    beforePlayingTheVideo: Symbol('before_playing_the_video'),
    middleOfTheVideo: Symbol('middle_of_the_video'),
    adsCanBeSkipped: Symbol('ads_can_be_skipped'),
    nextVideo: Symbol('next_video'),
    isPlayingAccordingToTheList: Symbol('is_playing_according_to_the_list'),
};
setInterval(() => {
    if (document.querySelector('.ytp-ad-skip-button-modern.ytp-button'))
        handleAdvertisement(typeOfAdvertisement.adsCanBeSkipped);
    else if (document.querySelector('.ytp-ad-text.ytp-ad-preview-text-modern')) {
        if (isJustStartedPlayingVideo)
            handleAdvertisement(typeOfAdvertisement.beforePlayingTheVideo);
        else handleAdvertisement(typeOfAdvertisement.middleOfTheVideo);
    } else if (
        document.querySelector(
            '.ytp-autonav-endscreen-upnext-header .ytp-autonav-endscreen-upnext-header-countdown-number'
        )
    ) {
        handleAdvertisement(typeOfAdvertisement.nextVideo);
    } else if (!isLoading) {
        time = Math.floor(document.querySelector('video')?.currentTime) || 0;
    }
}, 100);
const handleAdvertisement = (type) => {
    console.log('Ads: ', type);
    switch (type) {
        case typeOfAdvertisement.beforePlayingTheVideo:
            if (
                document.querySelectorAll(
                    '.playlist-items.style-scope.ytd-playlist-panel-renderer .ytd-playlist-panel-renderer'
                ).length > 0
            ) {
                handleAdvertisement(typeOfAdvertisement.isPlayingAccordingToTheList);
                break;
            }
            let id = window.location.href.split('?v=')[1]?.split('&')[0];
            if (id && !isLoading) {
                localStorage.setItem('time_ext_skip-first', ' date: ' + new Date());
                window.location = `https://youtu.be/${id}`;
                isLoading = true;
            }
            break;

        case typeOfAdvertisement.middleOfTheVideo:
            if (
                document.querySelectorAll(
                    '.playlist-items.style-scope.ytd-playlist-panel-renderer .ytd-playlist-panel-renderer'
                ).length > 0
            ) {
                handleAdvertisement(typeOfAdvertisement.isPlayingAccordingToTheList);
                break;
            }
            if (currentId && !isLoading) {
                localStorage.setItem('time_ext_skip', 'time: ' + time + ' - date: ' + new Date());
                window.location = `https://youtu.be/${currentId}?t=${time}`;
                isLoading = true;
            }
            break;

        case typeOfAdvertisement.adsCanBeSkipped:
            document.querySelector('.ytp-ad-skip-button-modern.ytp-button')?.click();
            break;
        case typeOfAdvertisement.nextVideo:
            if (
                document.querySelectorAll(
                    '.playlist-items.style-scope.ytd-playlist-panel-renderer .ytd-playlist-panel-renderer'
                ).length > 0
            ) {
                handleAdvertisement(typeOfAdvertisement.isPlayingAccordingToTheList);
                break;
            }
            document
                .querySelector(
                    '.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-play-button.ytp-autonav-endscreen-upnext-button-rounded'
                )
                ?.click();
            break;
        case typeOfAdvertisement.isPlayingAccordingToTheList:
            const showTime = (time) => {
                console.log(`Skip ads after ${time} seconds`);
                isLoading = true;
                setTimeout(() => {
                    isLoading = false;
                    console.log('Ads have finished playing');
                }, time * 1000);
            };
            let t =
                Math.floor(document.querySelector('video')?.duration || 0) -
                (Math.floor(document.querySelector('video')?.currentTime) || 0);

            if (t > 0 && !isLoading) showTime(t);
            break;
        default:
            console.log('Ads undefined!');
            break;
    }
};
const setDataOnload = () => {
    isLoading = false;
    let id = window.location.href.split('?v=')[1]?.split('&')[0];
    let t = window.location.href.split('?v=')[1]?.split('&')[1];
    if (id) {
        currentId = id;
        isJustStartedPlayingVideo = true;
        setTimeout(() => {
            isJustStartedPlayingVideo = false;
        }, 5000);
        time = 0;
    }
};
window.onload = () => {
    setDataOnload();
    navigation.addEventListener('navigate', () => {
        setDataOnload();
    });
};
