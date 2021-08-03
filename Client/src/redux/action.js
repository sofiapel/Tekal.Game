export const CHANGE_VIDEO = "CHANGE_VIDEO";
export const SEEN_VIDEOS = "SEE_VIDEOS";

export function changeVideo(newVideo) {
    return {
        type: CHANGE_VIDEO,
        payload: newVideo
    }
}

export function seenVideos(seenVideos) {
    return {
        type: SEEN_VIDEOS,
        payload: seenVideos
    }
}