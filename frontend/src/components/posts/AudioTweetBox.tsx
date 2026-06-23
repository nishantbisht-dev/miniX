"use client";

import Button from "@/components/common/Button";
import { createAudioPost } from "@/lib/audioPosts";
import { sendOtp, verifyOtp } from "@/lib/otp";
import { getAudioDuration } from "@/utils/audioDuration";
import { Mic, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function AudioTweetBox() {
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [duration, setDuration] = useState(0);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  async function handleAudioFile(file: File) {
    if (!file.type.startsWith("audio/")) {
      toast.error("Only audio files are allowed");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Audio file size cannot be more than 100 MB");
      return;
    }

    try {
      const audioDuration = await getAudioDuration(file);

      if (audioDuration > 300) {
        toast.error("Audio duration cannot be more than 5 minutes");
        return;
      }

      setAudioFile(file);
      setDuration(audioDuration);
      setAudioPreview(URL.createObjectURL(file));
    } catch (error: any) {
      toast.error(error.message || "Failed to read audio file");
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    await handleAudioFile(file);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      recordedChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async function () {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([blob], `audio-tweet-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());

        await handleAudioFile(file);
      };

      mediaRecorder.start();
      setRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error(error);
      toast.error("Microphone permission is required");
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);

    toast.success("Recording stopped");
  }

  async function handleSendOtp() {
    try {
      setOtpLoading(true);
      await sendOtp("audio_upload");
      setOtpSent(true);
      toast.success("OTP sent to your registered email");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    try {
      setOtpLoading(true);
      await verifyOtp("audio_upload", otp.trim());
      setOtpVerified(true);
      toast.success("OTP verified successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  }

  function clearAudio() {
    setAudioFile(null);
    setAudioPreview("");
    setDuration(0);
  }

  async function handleSubmit() {
    if (!audioFile) {
      toast.error("Please record or upload audio first");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify OTP before posting audio tweet");
      return;
    }

    try {
      setLoading(true);

      await createAudioPost({
        audioFile,
        text,
        duration,
      });

      toast.success("Audio tweet posted successfully");

      setText("");
      clearAudio();
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to post audio tweet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-b border-slate-800 px-4 py-5 sm:px-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Audio Tweet</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Record or upload audio. OTP verification is required before posting.
          </p>
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a caption for your audio tweet..."
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500 sm:text-base"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!recording ? (
            <Button type="button" onClick={startRecording} className="w-full sm:w-auto">
              <Mic className="mr-2 h-4 w-4" />
              Record Audio
            </Button>
          ) : (
            <Button type="button" onClick={stopRecording} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}

          <label className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {audioPreview && (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-300">
                Duration: {Math.round(duration)} seconds
              </p>

              <button
                type="button"
                onClick={clearAudio}
                className="text-left text-sm font-semibold text-red-400 sm:text-right"
              >
                Remove
              </button>
            </div>

            <audio controls src={audioPreview} className="w-full" />
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <h3 className="font-semibold text-white">OTP Verification</h3>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Audio tweets require OTP verification before upload.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto]">
            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading || otpVerified}
              className="w-full"
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Button>

            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
            />

            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpLoading || otpVerified}
              className="w-full"
            >
              {otpVerified ? "Verified" : "Verify"}
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm leading-6 text-yellow-200">
            Audio tweets are allowed only between 2:00 PM and 7:00 PM IST. Max
            duration is 5 minutes and max size is 100 MB.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !audioFile || !otpVerified}
            className="w-full sm:w-auto"
          >
            {loading ? "Posting..." : "Post Audio Tweet"}
          </Button>
        </div>
      </div>
    </section>
  );
}