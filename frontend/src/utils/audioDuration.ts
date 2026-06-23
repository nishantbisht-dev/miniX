export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");

    audio.preload = "metadata";

    audio.onloadedmetadata = function () {
      window.URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };

    audio.onerror = function () {
      reject(new Error("Unable to read audio duration"));
    };

    audio.src = URL.createObjectURL(file);
  });
}