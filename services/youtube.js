import axios from "axios";
import ytdl from "ytdl-core";
import fileSystem from "fs";
import { join } from "node:path";
import utils from "/services/utils.js";

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

async function downloadVideo(videoId) {
  try {
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "18" });
    const today = utils.getTodayDir();
    const outputDir = join("resources", "videos", today);
    const outputFilePath = join(outputDir, `${info.videoDetails.videoId}.mp4`);

    fileSystem.mkdirSync(outputDir, { recursive: true });
    const outputStream = fileSystem.createWriteStream(outputFilePath);
    ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);

    await new Promise((resolve, reject) => {
      outputStream.on("finish", resolve);
      outputStream.on("error", reject);
    });
  } catch (error) {
    if (error.message.includes("No such format found")) {
      console.log("VIDEO PRIVADO");
    } else {
      console.error("Error fetching video detail:", error);
      throw error;
    }
  }
}

export default {
  getLatestVideo,
  getVideoDetail,
  downloadVideo,
};
