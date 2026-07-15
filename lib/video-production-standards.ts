export type VideoProductionStandard = {
  id: string;
  label: string;
  requirement: string;
};

export const VIDEO_PRODUCTION_STANDARDS: VideoProductionStandard[] = [
  {
    id: "application-evidence",
    label: "Application-generated evidence",
    requirement: "Capture real application screens and outputs; never manufacture a successful result for the video.",
  },
  {
    id: "state-aware-capture",
    label: "State-aware capture",
    requirement: "Wait for the visible state or next action to change instead of relying on a fixed delay.",
  },
  {
    id: "small-beat-timeline",
    label: "Small-beat timeline",
    requirement: "Tie each narration beat to one visible screen, action, focus area, caption, and hold duration.",
  },
  {
    id: "stage-tutorial-duration",
    label: "Stage tutorial duration",
    requirement: "Use 5-10 minutes per substantial tutorial stage unless the production brief explicitly requires another format.",
  },
  {
    id: "safe-final-encode",
    label: "Safe final encode",
    requirement: "Re-encode the final concat as H.264/AAC instead of stream-copying independently encoded clips.",
  },
  {
    id: "artifact-verification",
    label: "Artifact verification",
    requirement: "Verify duration, resolution, codecs, file size, and an accurately decoded sample frame before delivery.",
  },
];

export function assertVerifiedVideo(metadata: {
  width: number;
  height: number;
  duration: number;
  size: number;
  videoCodec: string;
  audioCodec: string;
}) {
  if (metadata.width <= 0 || metadata.height <= 0) throw new Error("Video resolution is missing.");
  if (!Number.isFinite(metadata.duration) || metadata.duration <= 0) throw new Error("Video duration is invalid.");
  if (!Number.isFinite(metadata.size) || metadata.size <= 0) throw new Error("Video file is empty.");
  if (metadata.videoCodec !== "h264") throw new Error(`Expected H.264 video, received ${metadata.videoCodec || "none"}.`);
  if (metadata.audioCodec !== "aac") throw new Error(`Expected AAC audio, received ${metadata.audioCodec || "none"}.`);
}
