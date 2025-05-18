import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-center">Audio Player</h5>
          <audio ref={audioRef} src="/audio/sample.mp3" preload="auto" />

          <div className="d-flex justify-content-center my-3">            
            <button
              className="btn btn-success mx-2"
              onClick={handlePlay}
              disabled={playing}
            >
              Play
            </button>
            <button
              className="btn btn-warning mx-2"
              onClick={handlePause}
              disabled={!playing}
            >
              Pause
            </button>
            <button
              className="btn btn-danger mx-2"
              onClick={handleStop}
            >
              Stop
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="volumeRange" className="form-label">Volume: {volume}</label>
            <input
              id="volumeRange"
              type="range"
              className="form-range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolume}
            />
          </div>

          <div className="text-center mb-3">
            <button className="btn btn-outline-primary" onClick={toggleFilter}>
              {filterOn ? 'Remover Filtro' : 'Aplicar Filtro LP'}
            </button>
          </div>

          <svg width="100%" height="150" className="mt-4">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#333"/>
              </marker>
            </defs>
            <circle cx="50" cy="75" r="25" fill="#f8f9fa" stroke="#6c757d" />
            <text x="50" y="75" textAnchor="middle" dy="5" className="small">Source</text>

            <circle cx="200" cy="75" r="25" fill="#f8f9fa" stroke="#6c757d" />
            <text x="200" y="75" textAnchor="middle" dy="5" className="small">Gain</text>

            <circle
              cx="350"
              cy="75"
              r="25"
              fill={filterOn ? '#d1e7dd' : '#f8d7da'}
              stroke="#6c757d"
            />
            <text x="350" y="75" textAnchor="middle" dy="5" className="small">Filter</text>

            <line x1="75" y1="75" x2="175" y2="75" stroke="#6c757d" markerEnd="url(#arrow)" />
            <line x1="225" y1="75" x2="325" y2="75" stroke="#6c757d" markerEnd="url(#arrow)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
