import React, { useEffect, useRef } from 'react';

const Waveform: React.FC<{ audioStream: MediaStream }> = ({ audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioStream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024;
    source.connect(analyser);

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const drawSpectrum = () => {
      analyser.getByteFrequencyData(frequencyData);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 2;
      const barGap = 1;

      frequencyData.forEach((value, index) => {
        const barHeight = value / 2; // Scale the value for visualization
        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(index * (barWidth + barGap), canvas.height - barHeight, barWidth, barHeight);
      });

      requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();

    return () => {
      audioContext.close();
    };
  }, [audioStream]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100px'
      }}
    />
  );
};

export default Waveform;
