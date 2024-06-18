import { join } from "node:path";
import ollama from "ollama";
import fileSystem from "fs";

function getBadgeByDescription(description) {
  const regex = /EMBLEMA: (.+)/;
  const match = description.match(regex);

  const badge = match ? match[1] : "Emblema não encontrado";

  return badge;
}

async function detectBadgeFromOCR(videoId) {
  const ocrResultsDir = join("resources", "frames", videoId, "ocr_result.txt");

  const data = fileSystem.readFileSync(ocrResultsDir, "utf8");

  let badges = [];

  for (let index = 0; index < 3; index++) {
    const badgesFromAI = await getBadgesFromTextWithAI(data);
    badges.push(...badgesFromAI);
  }

  const uniqueBadges = removeDuplicatedBadges(badges);
  console.log(uniqueBadges);

  return uniqueBadges;
}

async function getBadgesFromTextWithAI(text) {
  const prompt = "Não inclua comentários na resposta";

  const response = await ollama.chat({
    model: "flow",
    messages: [{ role: "user", content: `${prompt} \n ${text}` }],
  });

  console.log(`Resposta \n ${response.message.content}`);

  try {
    return JSON.parse(response.message.content);
  } catch (error) {
    console.error("Erro ao analisar JSON:", error.message);
  }
}

function removeDuplicatedBadges(badges) {
  const seen = new Set();
  return badges.filter((badge) => {
    const duplicate = seen.has(badge.code);
    seen.add(badge.code);
    return !duplicate;
  });
}

export default {
  getBadgeByDescription,
  detectBadgeFromOCR,
};
