'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react'
import { Recording } from "../index";

interface VideoPlayerProps {
  recording: Recording | null;
}

export default function VideoPlayer({ recording }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  console.log("recording", recording)

  // Construct S3 URL using recording data

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [videoRef])

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
    }
  }

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10
    }
  }

  const handleSpeedChange = () => {
    const newRate = playbackRate === 2 ? 1 : 2
    setPlaybackRate(newRate)
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate
    }
  }

  if (!recording || !videoUrl) {
    return <video controls className="w-full h-full rounded-lg"><source src="" type="video/mp4" />Recording not found</video>;
  }

  console.log("videoUrl", videoUrl)

  return (
    <div className="space-y-4">
      
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-full rounded-lg"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
      {/* <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="w-full mx-4"
        />
        <Button variant="outline" size="icon" onClick={handleRewind}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleSpeedChange}>
          <FastForward className="h-4 w-4" />
          <span className="ml-1">{playbackRate}x</span>
        </Button>
      </div> */}
    </div>
  )
}
