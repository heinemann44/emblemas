import youtube from "services/youtube.js";
import badge from "services/badge.js";

async function getBadge(request, response) {
  const { channelId } = request.query;

  if (!channelId) {
    return response
      .status(400)
      .json({ error: "Missing channelId query parameter" });
  }

  try {
    const latestVideo = await youtube.getLatestVideo(channelId);
    const videoDetail = await youtube.getVideoDetail(latestVideo.videoId);
    const badgeCode = badge.getBadgeByDescription(videoDetail.description);
    response.status(200).json(badgeCode);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch the latest video" });
  }
}

export default getBadge;
