import { join } from "node:path";
import fileSystem from "fs";
import utils from "/services/utils.js";
import { createWorker } from "tesseract.js";
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const sharp = require("sharp");

ffmpeg.setFfmpegPath(ffmpegPath);

async function processVideo(videoId) {
  const inputVideoPath = join(
    "resources",
    "videos",
    utils.getTodayDir(),
    videoId + ".mp4",
  );
  const outputDir = join("resources", "frames", videoId);
  const outputFramesPath = join(outputDir, "frame-%03d.png");

  fileSystem.mkdirSync(outputDir, { recursive: true });

  await extractFrames(inputVideoPath, outputFramesPath);

  await processFrames(outputDir);

  await extractTextFromFrames(outputDir);
}

async function extractFrames(inputVideoPath, outputFramesPath) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputVideoPath)
      .on("start", function (commandLine) {
        console.log("Iniciado ffmpeg com comando: " + commandLine);
      })
      .on("end", resolve)
      .on("error", reject)
      .outputOptions(["-vf", "fps=1/4"])
      .output(outputFramesPath)
      .run();
  });

  console.log("Finalizado ffmpeg");
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
    .withMetadata({ density: 300 })
    .toFile(frameOutputDir);
}

function deleteFile(directory, file) {
  fileSystem.unlinkSync(join(directory, file));
}

async function extractTextFromFrames(outputFramesDir) {
  const files = fileSystem.readdirSync(outputFramesDir);
  const frameFiles = files.filter(
    (file) => file.startsWith("crop-frame") && file.endsWith(".png"),
  );
  const worker = await createWorker("por");

  console.log(`Iniciado OCR dos frames ${outputFramesDir}`);

  let ocrResults = "";

  for (const frameFile of frameFiles) {
    const ret = await worker.recognize(join(outputFramesDir, frameFile));

    if (ret.data.text.trim()) {
      ocrResults += `${ret.data.text}`;
    }
  }

  await worker.terminate();

  const resultFilePath = join(outputFramesDir, "ocr_result.txt");
  fileSystem.writeFileSync(resultFilePath, ocrResults);

  console.log(`Finalizado OCR dos frames ${outputFramesDir} com sucesso`);
}

export default {
  processVideo,
};
