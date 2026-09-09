"use client";

import { useState, useEffect, useRef } from 'react';

export default function HomeDashboard() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('I need a 2BHK near Indiranagar under ₹45,000 with lift and reserved parking');
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('INIT');
  const [properties, setProperties] = useState<any[]>([]);
  
  // Booking Form State
  const [selectedDate, setSelectedDate] = useState("Tomorrow, Oct 25");
  const [selectedTime, setSelectedTime] = useState("2:00 PM");
  const [selectedProperty, setSelectedProperty] = useState("Greenwood Heights — Unit 402");
  const [bookName, setBookName] = useState("Patel E.");
  const [bookPhone, setBookPhone] = useState("+91 98765 43210");
  const [bookNotes, setBookNotes] = useState("Requires power wheelchair turning clearance verification.");

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Processing audio...' }]);
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
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Microphone access denied.');
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
        if (newTranscript) {
          handleSend(newTranscript);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', text: 'Could not hear anything clearly.' }]);
          setIsLoading(false);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Error transcribing audio.' }]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Backend STT failed.' }]);
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
      speakText(assistantText);
      
      // Parse potential properties
      const regex = /```json\n([\s\S]*?)\n```/;
      const match = assistantText.match(regex);
      if (match) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed[0]?.rent_amount) {
          setProperties(parsed);
        }
      }
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the backend server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTranscript = () => {
    setMessages([]);
  };

  const speakText = async (text: string) => {
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\*\*/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .trim();

    if (!cleanText) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('TTS failed', await response.text());
      }
    } catch (err) {
      console.error('TTS fetch error', err);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Site visit successfully confirmed for ${bookName} at ${selectedProperty} on ${selectedDate.replace(" (Selected)", "")} at ${selectedTime}. An SMS gate pass has been dispatched to ${bookPhone}.`);
  };

  const prefillBooking = (propertyName: string) => {
    setSelectedProperty(propertyName);
    const target = document.getElementById("concierge-booking-section");
    if(target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative pt-20 min-h-screen bg-background focus:outline-none" id="main-content" tabIndex={-1}>
      <div className="flex flex-col w-full">
<div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-space-lg flex flex-col gap-space-xl">
{/*  TOP SECTION: LIVE VOICE & INPUT COMMAND BAR  */}
<section aria-labelledby="voice-command-title" className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
<div>
<h1 className="font-headline-md text-headline-md text-on-surface font-bold" id="voice-command-title">
            Property Voice Command &amp; Accessible Search
          </h1>

</div>
{/*  Real-time Voice State Indicator  */}
<div aria-label="System status" className="flex items-center gap-space-xs self-start md:self-auto bg-surface-container-low px-space-md py-space-2xs rounded-full">
<span aria-hidden="true" className="relative flex h-3 w-3">
<span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isListening ? "bg-error" : "bg-secondary hidden"}`} id="status-pulse"></span>
<span className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? "bg-error" : "bg-secondary"}`} id="status-dot"></span>
</span>
<span className="font-label-md text-label-md text-on-surface font-semibold" id="voice-engine-status">{isListening ? "Voice Engine: Listening..." : "Voice Engine: Ready"}</span>
</div>
</div>
{/*  Live Voice Announcement Region  */}
<div aria-atomic="true" aria-live="polite" className="sr-only" id="voice-screenreader-feedback">
        Voice command engine ready. Search homes using voice or keyboard input.
      </div>
{/*  Controls: Mic + Text Search  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-end">
{/*  Voice Action Button Box  */}
<div className="lg:col-span-4 flex flex-col gap-space-2xs">
<span className="font-label-md text-label-md text-on-surface font-semibold" id="voice-btn-helper">
            Voice Assistant Control
          </span>
<button aria-describedby="voice-btn-helper" aria-pressed={isListening} className={`min-h-target-min h-12 w-full px-space-md rounded-lg text-on-secondary hover:bg-primary-container focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary font-body-bold text-body-bold flex items-center justify-center gap-space-xs transition-colors shadow-sm ${isListening ? 'bg-error' : 'bg-secondary'}`} id="mic-toggle-btn" type="button" onClick={toggleListening}>
<span aria-hidden="true" className="material-symbols-outlined text-[24px]" id="mic-icon">{isListening ? 'stop_circle' : 'mic'}</span>
<span id="mic-label" className="">{isListening ? 'Listening... Click to stop' : 'Start speaking query'}</span>
</button>
</div>
{/*  Text Input Search Box  */}
<div className="lg:col-span-8 flex flex-col gap-space-2xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="direct-property-input">
            Search properties by voice or typing
          </label>
<div className="flex flex-col sm:flex-row gap-space-xs">
<input className="flex-1 min-h-target-min h-12 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary border border-outline-variant" id="direct-property-input" type="text" value={transcript} onChange={(e) => setTranscript(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(transcript)} />
<button className="min-h-target-min h-12 px-space-lg rounded-lg bg-primary-container text-on-primary hover:bg-primary focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary font-body-bold text-body-bold shrink-0 flex items-center justify-center gap-space-2xs shadow-sm transition-colors" id="submit-search-btn" type="button" onClick={() => handleSend(transcript)} disabled={isLoading}>
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">search</span>
<span className="">Search Properties</span>
</button>
</div>
</div>
</div>
{/*  Live Transcript Card  */}
<section aria-label="Current Voice Session Transcript" className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-2xs">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">record_voice_over</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Speech Transcript</h2>
</div>
<span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
            Audio Stream Synchronized
          </span>
</div>
<div className="space-y-space-xs text-body-md font-body-md max-h-64 overflow-y-auto">
{messages.length === 0 && <div className="p-space-xs text-on-surface-variant">No active transcript...</div>}
{messages.map((msg, idx) => (
  <div key={idx} className="p-space-xs rounded-lg bg-surface-container-lowest">
    <span className={`font-body-bold text-body-bold ${msg.role === 'user' ? 'text-secondary' : 'text-on-tertiary-container'}`}>
      {msg.role === 'user' ? 'YOU:' : 'SCOUT AI:'}
    </span>
    <span className="text-on-surface ml-1">“{msg.text}”</span>
  </div>
))}
{isLoading && <div className="p-space-xs text-on-surface-variant animate-pulse">Scout is typing...</div>}
</div>
<div className="flex flex-wrap gap-space-xs pt-space-2xs">
<button className="min-h-target-min px-space-sm py-space-2xs rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-1 transition-colors"  type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">edit_note</span>
<span className="">Edit request in text</span>
</button>
<button className="min-h-target-min px-space-sm py-space-2xs rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-1 transition-colors"  type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">delete_sweep</span>
<span className="">Clear transcript</span>
</button>
<button className="min-h-target-min px-space-sm py-space-2xs rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-1 transition-colors"  type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">replay</span>
<span className="">Retry voice input</span>
</button>
</div>
</section>
</section>
{/*  SECTION 2: FILTER & ACCESSIBILITY CONTROLS TOOLBAR  */}
<section aria-labelledby="filter-section-heading" className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold" id="filter-section-heading">
          Accessibility Toolbar &amp; Search Constraints
        </h2>
<div className="flex items-center gap-space-xs">
<button className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-1 transition-colors" id="reset-filter-btn" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">restart_alt</span>
<span className="">Reset Filters</span>
</button>
<button className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center gap-1 transition-colors" id="undo-filter-btn" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">undo</span>
<span className="">Undo Last Change</span>
</button>
</div>
</div>
{/*  Filter Controls Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
{/*  Budget Filter  */}
<fieldset className="lg:col-span-4 p-0 m-0 border-0 flex flex-col gap-space-xs">
<legend className="font-label-md text-label-md text-on-surface font-semibold mb-space-2xs">
            Monthly Budget Range
          </legend>
<div aria-label="Budget Range Filter" className="flex flex-wrap gap-space-xs" role="radiogroup">
<button aria-checked="false" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              Under ₹35k
            </button>
<button aria-checked="true" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              ₹35k - ₹50k (Active)
            </button>
<button aria-checked="false" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              ₹50k+
            </button>
</div>
</fieldset>
{/*  Bedrooms Filter  */}
<fieldset className="lg:col-span-3 p-0 m-0 border-0 flex flex-col gap-space-xs">
<legend className="font-label-md text-label-md text-on-surface font-semibold mb-space-2xs">
            Bedrooms Configuration
          </legend>
<div aria-label="Bedroom Filter" className="flex flex-wrap gap-space-xs" role="radiogroup">
<button aria-checked="false" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              1 BHK
            </button>
<button aria-checked="true" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              2 BHK (Active)
            </button>
<button aria-checked="false" className="min-h-target-min px-space-md py-space-2xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary transition-colors" role="radio" type="button">
              3 BHK
            </button>
</div>
</fieldset>
{/*  Accessibility Essentials Checkboxes  */}
<fieldset className="lg:col-span-5 p-0 m-0 border-0 flex flex-col gap-space-xs">
<legend className="font-label-md text-label-md text-on-surface font-semibold mb-space-2xs">
            Physical Accessibility Criteria
          </legend>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
<label className="min-h-target-min flex items-center gap-space-xs px-space-xs py-space-2xs rounded-lg hover:bg-surface-container-low cursor-pointer">
<input defaultChecked readOnly className="w-5 h-5 accent-secondary rounded focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" type="checkbox" />
<span className="font-body-md text-body-md text-on-surface">Step-free Entrance</span>
</label>
<label className="min-h-target-min flex items-center gap-space-xs px-space-xs py-space-2xs rounded-lg hover:bg-surface-container-low cursor-pointer">
<input defaultChecked readOnly className="w-5 h-5 accent-secondary rounded focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" type="checkbox" />
<span className="font-body-md text-body-md text-on-surface">Working Elevator</span>
</label>
<label className="min-h-target-min flex items-center gap-space-xs px-space-xs py-space-2xs rounded-lg hover:bg-surface-container-low cursor-pointer">
<input defaultChecked readOnly className="w-5 h-5 accent-secondary rounded focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" type="checkbox" />
<span className="font-body-md text-body-md text-on-surface">Wide Doors (&gt;34")</span>
</label>
<label className="min-h-target-min flex items-center gap-space-xs px-space-xs py-space-2xs rounded-lg hover:bg-surface-container-low cursor-pointer">
<input defaultChecked readOnly className="w-5 h-5 accent-secondary rounded focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary" type="checkbox" />
<span className="font-body-md text-body-md text-on-surface">Reserved Stilt Parking</span>
</label>
</div>
</fieldset>
</div>
{/*  Live Match Summary Bar  */}
<div className="bg-surface-container-high rounded-lg p-space-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">tune</span>
<p className="font-body-bold text-body-bold text-on-surface">
            4 Accessible Homes Found — Ranked by WCAG &amp; Tenant Match
          </p>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">
          Sorted by: Physical Mobility Suitability
        </span>
</div>
</section>
{/*  SECTION 3: PROPERTY CARDS GRID  */}
<section aria-label="Available Accessible Properties List" className="w-full flex flex-col gap-space-lg">
<div className="flex items-center justify-between">
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          Verified Match Results
        </h2>
<span className="font-label-md text-label-md text-on-surface-variant">
          Showing 1 - 2 of 4 residences
        </span>
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg items-start">
{properties.length === 0 ? (
  <div className="p-space-lg text-center text-on-surface-variant col-span-full">
    Search using voice or text to see available properties here.
  </div>
) : (
  properties.map((prop, idx) => (
    <article key={prop.id || idx} aria-labelledby={`prop-${idx}-title`} className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md">
      {/* Card Header & Match Score */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-xs flex-wrap">
          <div>
            <span className="inline-block px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold mb-space-2xs">
              Voice command shortcut: “Select {prop.society || `Property ${idx+1}`}”
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold" id={`prop-${idx}-title`}>
              {prop.society || `Property ${idx+1}`}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-secondary">place</span>
              <span className="">Bengaluru</span>
            </p>
          </div>
          {/* High-Contrast Match Badge */}
          <div aria-label={`Accessibility match score ${prop.score || 90} percent`} className="flex items-center gap-space-xs bg-surface-container-low p-space-xs rounded-xl">
            <svg aria-hidden="true" className="w-12 h-12 shrink-0 -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
              <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${prop.score || 90}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
            </svg>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">{prop.score || 90}%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Accessibility Match</span>
            </div>
          </div>
        </div>
        {/* Match Explanation Text */}
        {prop.explanation && (
          <p className="p-space-xs rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface">
            <strong className="font-body-bold">AI Match Explanation:</strong> {prop.explanation}
          </p>
        )}
      </div>

      {/* Financial and Spatial Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs bg-surface-container-high p-space-sm rounded-lg text-center">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Rent / Month</span>
          <span className="font-body-bold text-body-bold text-on-surface">₹{prop.rent_amount?.toLocaleString('en-IN') || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Configuration</span>
          <span className="font-body-bold text-body-bold text-on-surface">{prop.bhk} BHK ({prop.sqft || 'N/A'} sq.ft)</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Location Info</span>
          <span className="font-body-bold text-body-bold text-on-surface">{prop.lat?.toFixed(3)}, {prop.lng?.toFixed(3)}</span>
        </div>
      </div>

      {/* Verification Badges */}
      <div aria-label="Verification and On-site Audit Status" className="flex flex-col gap-space-xs" role="region">
        <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
          Verification Audit Details
        </h4>
        
        <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low">
          <span aria-hidden="true" className={`material-symbols-outlined ${prop.step_free ? 'text-secondary' : 'text-outline'} text-[20px] shrink-0 mt-0.5`}>
            {prop.step_free ? 'check_circle' : 'help_outline'}
          </span>
          <div className="text-body-md font-body-md text-on-surface">
            <strong className={`font-body-bold ${prop.step_free ? 'text-secondary' : 'text-on-surface'}`}>Step-Free Entrance:</strong> {prop.step_free ? 'Verified' : 'Unverified or Not Step-Free'}
          </div>
        </div>

        <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low">
          <span aria-hidden="true" className={`material-symbols-outlined ${prop.elevator ? 'text-secondary' : 'text-outline'} text-[20px] shrink-0 mt-0.5`}>
            {prop.elevator ? 'check_circle' : 'help_outline'}
          </span>
          <div className="text-body-md font-body-md text-on-surface">
            <strong className={`font-body-bold ${prop.elevator ? 'text-secondary' : 'text-on-surface'}`}>Elevator:</strong> {prop.elevator ? 'Available' : 'Unverified or No Elevator'}
          </div>
        </div>

        <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low">
          <span aria-hidden="true" className={`material-symbols-outlined ${prop.reserved_parking ? 'text-secondary' : 'text-outline'} text-[20px] shrink-0 mt-0.5`}>
            {prop.reserved_parking ? 'check_circle' : 'help_outline'}
          </span>
          <div className="text-body-md font-body-md text-on-surface">
            <strong className={`font-body-bold ${prop.reserved_parking ? 'text-secondary' : 'text-on-surface'}`}>Reserved Parking:</strong> {prop.reserved_parking ? 'Verified' : 'Unverified'}
          </div>
        </div>
      </div>

      {/* Text Alternatives for Neighborhood & Transit */}
      {prop.amenities && prop.amenities.length > 0 && (
        <div className="p-space-xs rounded-lg bg-surface-container flex flex-col gap-space-2xs">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">
            Pedestrian &amp; Transit Proximity (Flat Walkway Audit)
          </h4>
          <ul className="list-none space-y-1 text-body-md font-body-md text-on-surface pl-0">
            {prop.amenities.map((amenity: string, aIdx: number) => (
              <li key={aIdx} className="flex items-center gap-space-xs">
                <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">place</span>
                <span className="">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Card Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-space-xs pt-space-xs border-t border-outline-variant mt-auto">
        <button onClick={() => prefillBooking(prop.society)} className="min-h-target-min px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary hover:bg-primary-container font-body-bold text-body-bold focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center justify-center gap-space-2xs transition-colors shadow-sm flex-1" type="button">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span className="">Book site visit</span>
        </button>
        <button className="min-h-target-min px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-body-bold text-body-bold focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center justify-center gap-space-2xs transition-colors" type="button">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">bookmark_add</span>
          <span className="">Save</span>
        </button>
      </div>
    </article>
  ))
)}
</div>
</section>
{/*  SECTION 4: INLINE BOOKING & APPOINTMENT MODAL / SECTION  */}
<section aria-labelledby="booking-heading" className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-lg" id="concierge-booking-section">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface font-bold" id="booking-heading">
            Book an In-Person Site Visit with an Accessibility Concierge
          </h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Every booking includes an accompanied walk-through checking ramp slopes, doorway widths, and elevator dimensions.
          </p>
</div>
{/*  Voice shortcut prompt box  */}
<div className="bg-surface-container-low px-space-md py-space-xs rounded-xl flex items-center gap-space-xs self-start md:self-auto">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">mic</span>
<span className="font-label-md text-label-md text-on-surface">
            Or say: <strong>“Book tomorrow at 2 PM with Greenwood Heights”</strong>
</span>
</div>
</div>
{/*  Selected Property Focus  */}
<div className="p-space-xs rounded-lg bg-surface-container-high flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">home_work</span>
<span className="font-body-bold text-body-bold text-on-surface">Currently Selected Property:</span>
<span className="font-body-md text-body-md text-on-surface" id="selected-property-name">{selectedProperty}</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Concierge: Rahul Menon (Certified Access Specialist)</span>
</div>
<form className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg" id="booking-form" onSubmit={handleBookingSubmit} >
{/*  Slot Selection: Date & Time  */}
<div className="lg:col-span-6 flex flex-col gap-space-md">
{/*  Date Radio Group  */}
<fieldset className="p-0 m-0 border-0 flex flex-col gap-space-xs">
<legend className="font-label-md text-label-md text-on-surface font-semibold">
              Select Inspection Date (Required)
            </legend>
<div aria-label="Visit Date Selector" className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs" role="radiogroup">
<button aria-checked={selectedDate === "Today, Oct 24"} className={`min-h-target-min px-space-md py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedDate === "Today, Oct 24" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedDate("Today, Oct 24")}>Today, Oct 24</button>
<button aria-checked={selectedDate === "Tomorrow, Oct 25"} className={`min-h-target-min px-space-md py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedDate === "Tomorrow, Oct 25" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedDate("Tomorrow, Oct 25")}>Tomorrow, Oct 25</button>
<button aria-checked={selectedDate === "Saturday, Oct 26"} className={`min-h-target-min px-space-md py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedDate === "Saturday, Oct 26" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedDate("Saturday, Oct 26")}>Saturday, Oct 26</button>
</div>
</fieldset>
{/*  Time Slot Radio Group  */}
<fieldset className="p-0 m-0 border-0 flex flex-col gap-space-xs">
<legend className="font-label-md text-label-md text-on-surface font-semibold">
              Select Time Slot (Required)
            </legend>
<div aria-label="Visit Time Slot Selector" className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs" role="radiogroup">
<button aria-checked={selectedTime === "10:30 AM"} className={`min-h-target-min px-space-xs py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedTime === "10:30 AM" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedTime("10:30 AM")}>10:30 AM</button>
<button aria-checked={selectedTime === "2:00 PM"} className={`min-h-target-min px-space-xs py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedTime === "2:00 PM" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedTime("2:00 PM")}>2:00 PM</button>
<button aria-checked={selectedTime === "4:30 PM"} className={`min-h-target-min px-space-xs py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedTime === "4:30 PM" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedTime("4:30 PM")}>4:30 PM</button>
<button aria-checked={selectedTime === "6:00 PM"} className={`min-h-target-min px-space-xs py-space-sm rounded-lg font-label-md text-label-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary text-center transition-colors ${selectedTime === "6:00 PM" ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`} role="radio" type="button" onClick={() => setSelectedTime("6:00 PM")}>6:00 PM</button>
</div>
</fieldset>
<div className="p-space-xs rounded-lg bg-surface-container flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">accessible_forward</span>
<span className="font-body-md text-body-md text-on-surface">Concierge brings laser measuring tool &amp; threshold level ramps for testing.</span>
</div>
</div>
{/*  Form Details Input  */}
<div className="lg:col-span-6 flex flex-col gap-space-md">
<div className="flex flex-col gap-space-2xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="book-full-name">
              Full Name (required)
            </label>
<input aria-describedby="name-desc" className="min-h-target-min h-12 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary border border-outline-variant" id="book-full-name" name="fullname" required type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
<span className="font-label-sm text-label-sm text-on-surface-variant" id="name-desc">
              Required for society security clearance and visitor register pass.
            </span>
</div>
<div className="flex flex-col gap-space-2xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="book-phone">
              Mobile Phone Number for SMS updates (required)
            </label>
<input aria-describedby="phone-desc" className="min-h-target-min h-12 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary border border-outline-variant" id="book-phone" name="phone" required type="tel" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)} />
<span className="font-label-sm text-label-sm text-on-surface-variant" id="phone-desc">
              We send direct SMS gate pass and emergency contact details for the agent.
            </span>
</div>
<div className="flex flex-col gap-space-2xs">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="book-mobility-notes">
                Specific Mobility or Accessibility Requirements (optional)
              </label>
<span className="font-label-sm text-label-sm text-on-surface-variant" id="char-count">54 / 200</span>
</div>
<textarea className="p-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary border border-outline-variant resize-y" id="book-mobility-notes" maxLength={200} name="notes" rows={3} value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} />
</div>
{/*  Submit Button  */}
<button className="min-h-target-min h-12 w-full px-space-lg rounded-lg bg-secondary text-on-secondary hover:bg-primary-container font-body-bold text-body-bold focus:outline focus:outline-3 focus:outline-offset-2 focus:outline-secondary flex items-center justify-center gap-space-xs shadow-md transition-colors" id="confirm-booking-btn" type="submit">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">check_circle</span>
<span id="booking-btn-text" className="">Confirm Booking for {selectedDate} at {selectedTime}</span>
</button>
</div>
</form>
</section>
{/*  SECTION 5: ACCESSIBILITY COMPLIANCE AUDIT FOOTER / BAR  */}

</div>
</div>

    </main>
  );
}
