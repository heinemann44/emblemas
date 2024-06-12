import { join } from "node:path";
import fileSystem from "fs";
import utils from "/services/utils.js";
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const sharp = require("sharp");

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

  await generateFrames(inputVideoPath, outputFramesPath);

  await processFrames(outputDir);
}

async function generateFrames(inputVideoPath, outputFramesPath) {
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
      .outputOptions(["-vf", "fps=1/4"])
      .output(outputFramesPath)
      .run();
  });
}

async function processFrames(outputFramesDir) {
  const files = fileSystem.readdirSync(outputFramesDir);
  const frameFiles = files.filter(
    (file) => file.startsWith("frame-") && file.endsWith(".png"),
  );

  console.log(`Iniciado processamento dos frames ${outputFramesDir}`);

  for (const frameFile of frameFiles) {
    await cropFrame(outputFramesDir, frameFile);
    deleteFile(outputFramesDir, frameFile);
  }

  console.log(
    `Finalizado processamento dos frames ${outputFramesDir} com sucesso`,
  );
}

async function cropFrame(directory, file) {
  const frameInputDir = join(directory, file);
  const frameOutputDir = join(directory, "crop-" + file);

  await sharp(frameInputDir)
    .extract({ left: 0, top: 280, width: 550, height: 80 })
    .toFile(frameOutputDir);
}

function deleteFile(directory, file) {
  fileSystem.unlinkSync(join(directory, file));
}

export default {
  extractFrames,
};
