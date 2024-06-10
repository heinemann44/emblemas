import youtube from "services/youtube.js";
import video from "services/video.js";

async function downloadVideo(request, response) {
  const { channelId } = request.query;

  if (!channelId) {
    return response
      .status(400)
      .json({ error: "Missing channelId query parameter" });
  }

  try {
    const latestVideo = await youtube.getLatestVideo(channelId);
    await youtube.downloadVideo(latestVideo.videoId);
    await video.extractFrames(latestVideo.videoId);

    response.status(200).json("download complete");
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to download video" });
  }
}

export default downloadVideo;
