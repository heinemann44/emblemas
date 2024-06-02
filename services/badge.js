function getBadgeByDescription(description) {
  const regex = /EMBLEMA: (.+)/;
  const match = description.match(regex);

  const badge = match ? match[1] : "Emblema não encontrado";

  return badge;
}

export default {
  getBadgeByDescription,
};
