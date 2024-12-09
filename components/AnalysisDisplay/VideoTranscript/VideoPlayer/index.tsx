'use client'

import { useState, useRef, useEffect } from 'react'
import { Recording } from "../index";

interface VideoPlayerProps {
  recording: Recording | null;
}

export default function VideoPlayer({ recording }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Construct S3 URL using recording data



  useEffect(() => {
    if (recording) {
      const fetchRecordingDownload = async () => {
        const response = await fetch(`/api/bot/recordings/${recording.id}/access-link`);
        const data = await response.json();
        setVideoUrl(data.download_link);
      };
      fetchRecordingDownload();
    }
  }, [recording]);


  if (!recording || !videoUrl) {
    return <video controls className="w-full h-full rounded-lg"><source src="" type="video/mp4" />Recording not found</video>;
  }

  return (
    <div className="space-y-4">
      
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-full rounded-lg"
          preload="metadata"
        />
      </div>
     
    </div>
  )
}
