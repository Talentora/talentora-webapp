'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { Recording } from "../index";

interface VideoPlayerProps {
  recording: Recording | null;
}

export default function VideoPlayer({ recording }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchVideoUrl = async () => {
    if (!recording?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First get the recording details
      const recordingResponse = await fetch(`/api/bot/recordings/${recording.id}`);
      if (!recordingResponse.ok) throw new Error('Failed to fetch recording details');
      const recordingData = await recordingResponse.json();
      
      // Accept both 'completed' and 'finished' as valid statuses
      if (!['completed', 'finished'].includes(recordingData.status)) {
        throw new Error(`Recording not ready. Status: ${recordingData.status}`);
      }

      // Then get the access link
      const response = await fetch(`/api/bot/recordings/${recording.id}/access-link`);
      if (!response.ok) throw new Error('Failed to fetch video access link');
      
      const data = await response.json();
      console.log('Video access data:', data); // Debug log

      if (data.download_link) {
        setVideoUrl(data.download_link);
      } else {
        throw new Error('No download link in response');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoUrl();
  }, [recording?.id, retryCount]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    const videoElement = e.target as HTMLVideoElement;
    setError(`Video error: ${videoElement.error?.message || 'Unknown error'}`);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (!recording) {
    return <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">No recording available</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading video...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-500 flex flex-col items-center gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Recording ID: {recording.id}</p>
            <p className="font-medium">{error}</p>
          </div>
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full rounded-lg"
            preload="auto"
            onError={handleVideoError}
            crossOrigin="anonymous"
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading Video
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
