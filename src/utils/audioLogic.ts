export const audio = (filename: string) => {
  const sound = new Audio(`./assets/mp3/${filename}.mp3`);
  sound.currentTime = 0;
  return sound;
};