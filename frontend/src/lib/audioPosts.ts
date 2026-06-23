import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createAudioPost({
  audioFile,
  text,
  duration,
}: {
  audioFile: File;
  text: string;
  duration: number;
}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in");
  }

  const token = await user.getIdToken();

  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("text", text);
  formData.append("duration", String(duration));

  const response = await fetch(`${API_URL}/posts/audio`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create audio tweet");
  }

  return data.post;
}