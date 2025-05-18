import React, { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [filterNode, setFilterNode] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100); // 0-100
  const [filterOn, setFilterOn] = useState(false);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    source.connect(gain);
    gain.connect(ctx.destination);

    setAudioCtx(ctx);
    setGainNode(gain);
    setFilterNode(filter);

    return () => {
      ctx.close();
    };
  }, []);

  const handlePlay = () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audioRef.current.play();
    setPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (audioCtx.state === 'running') {
      audioCtx.suspend();
    }
    setPlaying(false);
  };

  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    const gainValue = vol / 100;
    if (gainNode) {
      gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    }
  };

  const toggleFilter = () => {
    if (!gainNode || !filterNode) return;
    if (filterOn) {
      gainNode.disconnect();
      gainNode.connect(audioCtx.destination);
      filterNode.disconnect();
    } else {
      gainNode.disconnect();
      gainNode.connect(filterNode);
      filterNode.connect(audioCtx.destination);
    }
    setFilterOn(!filterOn);
  };

  return (
    <div className="p-4 space-y-4 border rounded shadow">
      <audio
        ref={audioRef}
        src="/audio/sample.mp3"
        preload="auto"
      />
      <div className="space-x-2">
        <button onClick={handlePlay} disabled={playing}>Play</button>
        <button onClick={handlePause} disabled={!playing}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <div>
        <label>Volume: {volume}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolume}
        />
      </div>
      <div>
        <button onClick={toggleFilter}>
          {filterOn ? 'Remover Filtro' : 'Aplicar Filtro LP'}
        </button>
      </div>
      <svg width="300" height="120" className="mt-4">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#333"/>
          </marker>
        </defs>
        <circle cx="50" cy="60" r="20" fill="#ddd" />
        <text x="50" y="60" textAnchor="middle" dy="5">Source</text>
        <circle cx="150" cy="60" r="20" fill="#ddd" />
        <text x="150" y="60" textAnchor="middle" dy="5">Gain</text>
        <circle cx="250" cy="60" r="20" fill={filterOn ? '#afa' : '#faa'} />
        <text x="250" y="60" textAnchor="middle" dy="5">Filter</text>
        <line x1="70" y1="60" x2="130" y2="60" stroke="#333" markerEnd="url(#arrow)" />
        <line x1="170" y1="60" x2="230" y2="60" stroke="#333" markerEnd="url(#arrow)" />
      </svg>
    </div>
  );
}
