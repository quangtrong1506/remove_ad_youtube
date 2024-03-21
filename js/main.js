const state = {
    time: 0, //? Thời gian video đang phát
    currentId: null, //? id video đang phát
    isHandleAds: false, //? Đang xử lý quảng cáo
    isPlayingAccordingToTheList: false, //? có phát dướu dạng danh sách không
    isLoad: true,
    listID: null,
    listIndex: null,
};
const typeOfAdvertisement = {
    shortAds: Symbol("short_ad"), // Quảng cáo ngắn hoặc k thể bỏ qua
    adsCanBeSkipped: Symbol("ads_can_be_skipped"), // có thể next
    nextVideo: Symbol("next_video"), // next video
};

const setDataOnload = () => {
    state.isHandleAds = false;
    let link = window.location.href;
    let arr = link.split("&");
    state.listID = arr.find((text) => text.match("list="))?.split("=")[1];
    state.listIndex = arr.find((text) => text.match("index="))?.split("=")[1];
    let id = window.location.href.split("?v=")[1]?.split("&")[0];
    let t = window.location.href.split("t=")[1]?.split("s")[0];
    console.log(state);
    if (
        document.querySelectorAll(
            ".playlist-items.style-scope.ytd-playlist-panel-renderer .ytd-playlist-panel-renderer"
        ).length > 0
    )
        state.isPlayingAccordingToTheList = true;
    if (id) {
        state.currentId = id;
        state.time = !isNaN(parseInt(t)) ? parseInt(t) : 0;
    } else {
        setTimeout(setDataOnload, 100);
    }
};
window.onload = () => {
    setDataOnload();
    changeStateAfterLoad();
    navigation.addEventListener("navigate", () => {
        setDataOnload();
        changeStateAfterLoad();
    });
    // Todo: Check ads
    setInterval(() => {
        if (state.isHandleAds || fs_status()) return;
        if (document.querySelector(".ytp-ad-skip-button-modern.ytp-button"))
            handleAdvertisement(typeOfAdvertisement.adsCanBeSkipped);
        else if (
            document.querySelector(".ytp-ad-text.ytp-ad-preview-text-modern") &&
            !state.isPlayingAccordingToTheList &&
            !state.isLoad
        ) {
            handleAdvertisement(typeOfAdvertisement.shortAds);
        } else if (
            document.querySelector(
                ".ytp-autonav-endscreen-upnext-header .ytp-autonav-endscreen-upnext-header-countdown-number"
            )
        ) {
            handleAdvertisement(typeOfAdvertisement.nextVideo);
        } else if (!state.isHandleAds) {
            let t = Math.floor(document.querySelector("video")?.currentTime) || 0;
            if (t > 10) state.time = t;
        }
    }, 100);
};
const changeStateAfterLoad = () => {
    setTimeout(() => {
        state.isLoad = false;
    }, 3000);
};
const handleAdvertisement = (type) => {
    console.log("Ads: ", type);
    switch (type) {
        //Todo: xử lý bỏ qua ads (cái không thể next)
        case typeOfAdvertisement.shortAds:
            if (
                state.currentId &&
                !state.isHandleAds &&
                !state.isPlayingAccordingToTheList &&
                !fs_status()
            ) {
                let query = `?t=${state.time}${alert}`;
                window.location = `https://youtu.be/${state.currentId}${query}`;
                state.isHandleAds = true;
            }
            break;
        //Todo: next video nếu có nút next
        case typeOfAdvertisement.adsCanBeSkipped:
            document
                .querySelector(
                    ".ytp-ad-skip-button-container.ytp-ad-skip-button-container-detached"
                )
                ?.click();
            document.querySelector(".ytp-ad-skip-button-modern.ytp-button")?.click();
            break;
        //Todo: hết video next luôn
        case typeOfAdvertisement.nextVideo:
            if (
                document.querySelectorAll(
                    ".playlist-items.style-scope.ytd-playlist-panel-renderer .ytd-playlist-panel-renderer"
                ).length > 0
            ) {
                handleAdvertisement(typeOfAdvertisement.isPlayingAccordingToTheList);
                break;
            }
            document
                .querySelector(
                    ".ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-play-button.ytp-autonav-endscreen-upnext-button-rounded"
                )
                ?.click();
            break;
        default:
            console.log("Ads undefined!");
            break;
    }
};

const fs_status = () => {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
    )
        return true;
    return false;
};

let handle = new Promise(function (myResolve, myReject) {
    setTimeout(() => {
        myResolve();
        return true;
    }, 3000);
    return false;
});

handle.then((value) => {
    console.log(value);
});
