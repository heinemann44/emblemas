import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;

async function getLatestVideo(channelId) {
  const url = "https://www.googleapis.com/youtube/v3/search";

  const params = {
    part: "snippet",
    order: "date",
    type: "video",
    channelId: channelId,
    maxResults: 10,
    key: API_KEY,
    eventType: "completed",
  };

  try {
    const response = await axios.get(url, { params });
    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      videoId: video.id.videoId,
    };
  } catch (error) {
    console.error("Error fetching the latest video:", error);
    throw error;
  }
}

async function getVideoDetail(videoId) {
  const url = "https://www.googleapis.com/youtube/v3/videos";

  const params = {
    key: API_KEY,
    part: "snippet",
    id: videoId,
  };

  try {
    const response = await axios.get(url, { params });

    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      description: video.snippet.description,
    };
  } catch (error) {
    console.error("Error fetching video detail:", error);
    throw error;
  }
}

export default {
  getLatestVideo,
  getVideoDetail,
};
