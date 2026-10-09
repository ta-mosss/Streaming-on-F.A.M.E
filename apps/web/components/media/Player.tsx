'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useProgress } from '@/lib/hooks/useProgress';

interface Props { titleId: string; episode?: number; onClose: () => void }
interface StreamData { hlsUrl: string; token: string; duration?: number }

export function Player({ titleId, episode, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<StreamData | null>(null);
  const [ready, setReady] = useState(false);
  const { update } = useProgress(titleId);

  useEffect(() => {
    const url = '/v1/stream/token/' + titleId + (episode !== undefined ? ('?ep=' + episode) : '');
    api
      .get<StreamData>(url)
      .then(setStream)
      .catch(() => onClose());
  }, [titleId, episode, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream.hlsUrl;
      setReady(true);
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;
        const hls = new Hls({
          xhrSetup: (xhr) => xhr.setRequestHeader('Authorization', 'Bearer ' + stream.token),
        });
        hls.loadSource(stream.hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setReady(true));
        return () => hls.destroy();
      });
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <button
        onClick={onClose}
        aria-label="Close player"
        className="absolute left-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur"
      >
        ✕
      </button>
      <video
        ref={videoRef}
        controls={ready}
        playsInline
        autoPlay
        className="h-full w-full"
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (Math.floor(v.currentTime) % 5 === 0) {
            update(v.currentTime, v.duration);
          }
        }}
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}
    </div>
  );
}