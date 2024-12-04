"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

export function VideoBackground() {
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the YouTube IFrame Player API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-player', {
        videoId: 'ZKCTooW5MNo', // Your video ID
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
          loop: 1,
          playlist: 'ZKCTooW5MNo', // Required for looping
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          start: 10, // Start 10 seconds into the video
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Cleanup
    return () => {
      // Remove the global callback
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  return (
    <div ref={playerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute bottom-4 right-4 z-[2] text-white hover:bg-white/20"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
      <div 
        id="youtube-player"
        className="absolute w-[100vw] h-[100vh] -top-[50%] -left-[50%] min-w-[200%] min-h-[200%]"
      />
    </div>
  );
}

// Add TypeScript declarations for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}