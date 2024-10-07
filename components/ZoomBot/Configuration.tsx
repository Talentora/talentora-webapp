"use client";
import React, { useState, useEffect } from 'react';

const Configuration = ({ onJoin }) => {
    const [audioDevices, setAudioDevices] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
    const [audioTest, setAudioTest] = useState(null);
    const [videoTest, setVideoTest] = useState(null);

    useEffect(() => {
        // Get available media devices (audio and video)
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const audio = devices.filter(device => device.kind === 'audioinput');
            const video = devices.filter(device => device.kind === 'videoinput');
            setAudioDevices(audio);
            setVideoDevices(video);
            
            // Set default devices
            if (audio.length > 0) setSelectedAudioDevice(audio[0].deviceId);
            if (video.length > 0) setSelectedVideoDevice(video[0].deviceId);
        });
    }, []);

    // Function to start video test
    const handleVideoTest = async () => {
        if (videoTest) {
            videoTest.getTracks().forEach(track => track.stop());
            setVideoTest(null);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedVideoDevice },
            });
            setVideoTest(stream);
        }
    };

    // Function to start audio test
    const handleAudioTest = async () => {
        if (audioTest) {
            audioTest.getTracks().forEach(track => track.stop());
            setAudioTest(null);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedAudioDevice },
            });
            setAudioTest(stream);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Device Configuration</h1>
            
            <div className="mb-4">
                <h2 className="text-xl mb-2">Select Microphone</h2>
                <select
                    className="border p-2 rounded mb-2"
                    value={selectedAudioDevice}
                    onChange={e => setSelectedAudioDevice(e.target.value)}
                >
                    {audioDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || 'Default Microphone'}
                        </option>
                    ))}
                </select>
                <button
                    className="ml-2 p-2 bg-blue-500 text-white rounded"
                    onClick={handleAudioTest}
                >
                    {audioTest ? 'Stop Audio Test' : 'Test Microphone'}
                </button>
            </div>
            
            <div className="mb-4">
                <h2 className="text-xl mb-2">Select Camera</h2>
                <select
                    className="border p-2 rounded mb-2"
                    value={selectedVideoDevice}
                    onChange={e => setSelectedVideoDevice(e.target.value)}
                >
                    {videoDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || 'Default Camera'}
                        </option>
                    ))}
                </select>
                <button
                    className="ml-2 p-2 bg-blue-500 text-white rounded"
                    onClick={handleVideoTest}
                >
                    {videoTest ? 'Stop Video Test' : 'Test Camera'}
                </button>
                {videoTest && (
                    <video
                        autoPlay
                        playsInline
                        width="300"
                        height="200"
                        className="border mt-2"
                        ref={videoElement => {
                            if (videoElement) videoElement.srcObject = videoTest;
                        }}
                    />
                )}
            </div>

            <button
                className="mt-4 p-2 bg-green-500 text-white rounded"
                onClick={() => onJoin(selectedAudioDevice, selectedVideoDevice)}
            >
                Join Meeting
            </button>
        </div>
    );
};

export default Configuration;
