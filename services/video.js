import { join } from "node:path";
import fileSystem from "fs";
import utils from "/services/utils.js";
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

async function extractFrames(videoId) {
  const inputVideoPath = join(
    "resources",
    "videos",
    utils.getTodayDir(),
    videoId + ".mp4",
  );
  const outputDir = join("resources", "frames", videoId);
  const outputFramesPath = join(outputDir, "frame-%03d.png");

  fileSystem.mkdirSync(outputDir, { recursive: true });

  await new Promise((resolve, reject) => {
    ffmpeg(inputVideoPath)
      .on("start", function (commandLine) {
        console.log("Iniciado ffmpeg com comando: " + commandLine);
      })
      .on("progress", function (progress) {
        console.log("Progresso: " + progress.frames + " frames processados");
      })
      .on("end", resolve)
      .on("error", reject)
      .outputOptions(["-vf", "fps=1/5"])
      .output(outputFramesPath)
      .run();
  });
}

export default {
  extractFrames,
};
