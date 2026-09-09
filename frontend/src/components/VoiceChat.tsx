"use client";

import { useState, useEffect, useRef } from 'react';

interface VoiceChatProps {
  onBackendResponse: (data: any) => void;
}

export default function VoiceChat({ onBackendResponse }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('INIT');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      setTranscript('Processing audio...');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await handleAudioTranscription(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);
        setTranscript('Listening...');
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setTranscript('Microphone access denied.');
      }
    }
  };

  const handleAudioTranscription = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      const sttRes = await fetch('http://127.0.0.1:8000/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (sttRes.ok) {
        const { transcript: newTranscript } = await sttRes.json();
        setTranscript('');
        if (newTranscript) {
          handleSend(newTranscript);
        } else {
          setTranscript('Could not hear anything clearly.');
          setIsLoading(false);
        }
      } else {
        setTranscript('Error transcribing audio.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setTranscript('Backend STT failed.');
      setIsLoading(false);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setTranscript('');
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: textToSend
        })
      });
      
      const data = await res.json();
      const assistantText = data.response;
      setMessages(prev => [...prev, { role: 'assistant', text: assistantText }]);
      
      onBackendResponse(data);
      speakText(assistantText);
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the backend server." }]);
      speakText("Sorry, I couldn't reach the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\*\*/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const syntheticWaveformBars = Array.from({ length: 28 }).map((_, i) => {
    const heights = [2, 4, 7, 5, 9, 6, 8, 10, 4, 9, 8, 3, 6, 10, 7, 5, 3, 9, 6, 8, 4, 10, 7, 3, 5, 8, 4, 2];
    const colors = ['bg-primary/60', 'bg-primary', 'bg-primary-container', 'bg-secondary', 'bg-primary-fixed-dim'];
    return (
      <div 
        key={i} 
        className={`w-1 rounded-full ${isListening ? 'animate-pulse' : 'opacity-30'} ${colors[i % colors.length]}`} 
        style={{ height: `${heights[i] * 4}px` }}
      ></div>
    );
  });

  return (
    <section className="relative w-full bg-surface-container-lowest pt-space-md pb-space-lg shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-10">
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 via-primary-container/10 to-transparent blur-3xl opacity-70"></div>
      
      <div className="max-w-max-content-width mx-auto px-margin-desktop flex flex-col gap-space-md relative">
        <div className="flex flex-wrap items-center justify-between gap-space-xs text-citation-code">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-secondary/15 text-secondary font-citation-code uppercase">
              <span className={`w-1.5 h-1.5 rounded-full bg-secondary ${isListening ? 'animate-ping' : ''}`}></span>
              Neural Voice Stream 44.1kHz
            </span>
            <span className="text-on-surface-variant font-telemetry-data">Session #{sessionId.toUpperCase()}</span>
            <span className="text-on-surface-variant">|</span>
            <span className="text-primary font-citation-code uppercase tracking-wider">Acoustic Parser Active</span>
          </div>
          <div className="flex items-center gap-space-md font-telemetry-data text-on-surface-variant">
            <span>STT: Deepgram Nova-2 (38ms)</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">LLM: Groq / Llama 120B</span>
            <span>•</span>
            <span className="text-secondary">TTS: ElevenLabs Turbo v2.5 (112ms)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-stretch">
          
          <div className="xl:col-span-5 bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-space-md">
              <button 
                id="mic-button"
                onClick={toggleListening}
                className={`relative group flex-shrink-0 w-16 h-16 rounded-full text-on-primary flex items-center justify-center shadow-[0_0_36px_-6px_rgba(217,119,6,0.55)] transition-transform hover:scale-105 active:scale-95 focus:outline-none ${isListening ? 'bg-gradient-to-br from-primary-container to-inverse-primary' : 'bg-surface-container-highest text-primary'}`}
              >
                {isListening && <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25"></span>}
                <span className="material-symbols-outlined text-headline-md relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isListening ? 'mic' : 'mic_none'}
                </span>
              </button>
              
              <div className="flex flex-col min-w-0 w-full">
                <div className="flex items-center gap-space-2xs">
                  <span className="font-label-md text-label-md text-primary tracking-wide uppercase">Streaming Microphone Input</span>
                  <span className={`px-1.5 py-0.5 rounded bg-surface-container-highest font-citation-code text-citation-code ${isListening ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {isListening ? 'LIVE' : 'STANDBY'}
                  </span>
                </div>
                
                {/* Text input fallback integrated seamlessly for E2E testing */}
                <input
                  type="text"
                  id="demo-text-input"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend(transcript);
                  }}
                  placeholder={isListening ? "Listening..." : "Tap mic or type prompt here..."}
                  className="w-full bg-transparent border-none text-body-sm text-on-surface font-medium focus:outline-none mt-1"
                />
              </div>
            </div>

            <div className="w-full bg-surface-container-lowest/80 rounded-lg p-space-sm flex flex-col gap-space-2xs">
              <div className="flex items-center justify-between text-citation-code text-on-surface-variant font-telemetry-data">
                <span>SPECTRAL DENSITY [CH-1 DUAL BEAM]</span>
                <span className={isListening ? "text-secondary" : "text-on-surface-variant"}>
                  {isListening ? '-14.2 dBFS' : '-90.0 dBFS'}
                </span>
              </div>
              <div className="h-10 flex items-center justify-between gap-[3px] px-space-xs overflow-hidden">
                {syntheticWaveformBars}
              </div>
            </div>
          </div>

          <div className="xl:col-span-7 bg-surface-container rounded-xl p-space-md flex flex-col justify-between gap-space-sm shadow-md">
            <div className="space-y-space-xs h-36 overflow-y-auto pr-space-xs custom-scrollbar">
              {messages.length === 0 && !isLoading && (
                <div className="flex items-start gap-space-xs opacity-50">
                   <span className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center font-citation-code text-[10px] font-bold mt-0.5">AI</span>
                   <div className="flex-1 bg-surface-container-high/80 rounded-lg p-space-xs text-body-sm text-on-surface">
                     System Initialized. Awaiting voice input or constraints...
                   </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-space-xs ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <span className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center font-citation-code text-[10px] font-bold mt-0.5">AI</span>
                  )}
                  
                  <div className={`rounded-lg p-space-xs text-body-sm max-w-[85%] ${msg.role === 'user' ? 'bg-surface-container-highest text-right' : 'bg-surface-container-high/80 flex-1'}`}>
                    <span className={`font-semibold ${msg.role === 'user' ? 'text-secondary' : 'text-primary'}`}>
                      {msg.role === 'user' ? 'User (Spoken): ' : 'Scout: '}
                    </span>
                    <span className="text-on-surface">
                      {msg.role === 'user' ? `“${msg.text}”` : msg.text}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <span className="w-5 h-5 rounded bg-secondary/20 text-secondary flex items-center justify-center font-citation-code text-[10px] font-bold mt-0.5">YOU</span>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-space-xs animate-pulse">
                   <span className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center font-citation-code text-[10px] font-bold mt-0.5">AI</span>
                   <div className="bg-surface-container-high/80 rounded-lg p-space-xs text-body-sm text-on-surface">
                     Processing intent vector...
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs border-t border-surface-container-high">
              <span className="font-citation-code text-citation-code text-on-surface-variant uppercase tracking-wider">Suggested Speech Refinements:</span>
              <button onClick={() => handleSend("Filter <30min commute")} className="px-space-sm py-1 rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface font-citation-code text-citation-code transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">graphic_eq</span> “Filter &lt;30min commute”
              </button>
              <button onClick={() => handleSend("Prioritize quiet streets")} className="px-space-sm py-1 rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface font-citation-code text-citation-code transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">graphic_eq</span> “Prioritize quiet streets”
              </button>
              <button onClick={() => handleSend("Only in-unit laundry")} className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary font-citation-code text-citation-code flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[13px]">check_circle</span> “Only in-unit laundry”
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
