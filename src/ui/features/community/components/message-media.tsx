import type { MediaType } from "@/domain/chat";
import { AudioPlayer } from "./audio-player";

export function MessageMedia({
  url,
  type,
  onOpenImage,
}: {
  url: string;
  type: MediaType;
  onOpenImage: (url: string) => void;
}) {
  if (type === "audio") return <AudioPlayer url={url} />;

  return (
    <button
      type="button"
      onClick={() => onOpenImage(url)}
      className="mb-1 block overflow-hidden rounded-lg"
    >
      <img
        src={url}
        alt=""
        loading="lazy"
        className="max-h-72 w-auto max-w-full rounded-lg object-cover"
      />
    </button>
  );
}
