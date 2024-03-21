const video = {
    id: null,
    time: null,
    isLoading: true,
    isAdRunning: false,
    list: {
        index: 0,
        id: null,
    },
};
const typeOfAdvertisement = {
    shortAds: Symbol("short_ad"),
    adsCanBeSkipped: Symbol("ads_can_be_skipped"),
    nextVideo: Symbol("next_video"),
};
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const isFullScreen = () => {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
    )
        return true;
    return false;
};
const checkStatus = async () => {
    video.isLoading = true;
    await delay(100);
    let url = location.href;
    let id = url.split("?v=")[1]?.split("&")[0];
    let arr = url.split("&");
    if (id) {
        video.id = id;
        video.list.id = arr.find((text) => text.match("list="))?.split("=")[1];
        video.list.index =
            arr.find((text) => text.match("index="))?.split("=")[1] ||
            arr.find((text) => text.match("start_radio="))?.split("=")[1] ||
            0;
    }
    video.isLoading = false;
};
const handleAdvertisement = (type) => {
    console.log("Ads: ", type);
    switch (type) {
        //Todo: xử lý bỏ qua ads (cái không thể next)
        case typeOfAdvertisement.shortAds:
            if (video.id) {
                let query = "?t=" + video.time;
                if (video.list.id) query += `&list=${video.list.id}&index=${video.list.index}`;
                if (!video.isAdRunning) window.location = `https://youtu.be/${video.id}${query}`;
                video.isAdRunning = true;
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

window.onload = async () => {
    await checkStatus();
    navigation.addEventListener("navigate", async () => {
        await checkStatus();
    });
    setInterval(() => {
        // Xóa quảng cáo
        if (location.pathname === "/")
            document.querySelector("ytd-ad-slot-renderer")?.parentNode?.parentNode?.remove();
        else document.querySelector("ytd-ad-slot-renderer")?.remove();
        document.getElementById("masthead-ad")?.remove();
        document.getElementById("player-ads")?.remove();
        //
        if (video.isLoading) return;
        if (document.querySelector(".ytp-ad-skip-button-modern.ytp-button"))
            return handleAdvertisement(typeOfAdvertisement.adsCanBeSkipped);
        if (document.querySelector(".ytp-ad-text.ytp-ad-preview-text-modern")) {
            return handleAdvertisement(typeOfAdvertisement.shortAds);
        }
        if (
            document.querySelector(
                ".ytp-autonav-endscreen-upnext-header .ytp-autonav-endscreen-upnext-header-countdown-number"
            )
        ) {
            return handleAdvertisement(typeOfAdvertisement.nextVideo);
        }
        let t = Math.floor(document.querySelector("video")?.currentTime) || 0;
        if (t > 3) video.time = t;
    }, 100);
};
