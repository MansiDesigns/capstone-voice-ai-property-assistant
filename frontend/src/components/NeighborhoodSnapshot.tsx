"use client";

interface NeighborhoodSnapshotProps {
  context: string;
  citations: any;
}

export default function NeighborhoodSnapshot({ context, citations }: NeighborhoodSnapshotProps) {
  if (!context) return null;

  return (
    <section className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-lg shadow-xl animate-fade-in h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-surface-container-high">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">satellite_alt</span>
            <span className="font-citation-code text-citation-code text-primary uppercase tracking-wider">
              Telemetry Engine Focus: {citations?.area || 'Bengaluru Suburbs'}
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Neighborhood Spatial Micro-Metrics</h3>
        </div>
        <span className="font-telemetry-data text-citation-code px-space-sm py-1 rounded bg-surface-container-lowest text-secondary">
          SYNCED: LIVE
        </span>
      </div>

      {/* Narrative Context (RAG Text) */}
      <div className="bg-surface-container-low p-space-md rounded-lg text-body-lg text-on-surface-variant border-l-4 border-primary">
        <p>{context}</p>
        {citations?.source && (
          <div className="mt-2 text-citation-code font-bold text-secondary">
            SOURCE CITATION: {citations.source}
          </div>
        )}
      </div>

      {/* Visual Map Telemetry Viewport (Static Decorative) */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdFH-NRBktFiLUodq0z27qkON1EN4g2WIsQ4huzhG1HMlWXC0i5jyVnaJGwC3IqPUfZX6RJ3a9nGR17h324mpxktlpQYghSQRV1-tPiMFLsfwhwuKGvntD8NKcI2XYd8evzWXtnDDgysd5UWhJ68J55hXH037XFJYdkm6pHP2__-4hMK0e0nEUiU7P-zuIwrig3xxEVkfRdD1ARllxJzWGv0lM3C3jLVudxLOF0T_02AwS1g3k9Q')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
        <div className="absolute bottom-space-sm left-space-sm bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-lg flex items-center gap-space-xs shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
          <span className="font-citation-code text-citation-code text-on-surface font-semibold">Nearest Transit • 4 Min Walk (280m)</span>
        </div>
        <div className="absolute top-space-sm right-space-sm bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-lg flex items-center gap-1 shadow-lg">
          <span className="material-symbols-outlined text-secondary text-[14px]">nature_people</span>
          <span className="font-citation-code text-citation-code text-on-surface">Park: 9 Min Walk</span>
        </div>
      </div>

      {/* Metric Grid (Static Decorative mock data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Transit Telemetry</span>
            <span className="material-symbols-outlined text-primary text-[18px]">directions_subway</span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold">26 <span className="text-body-sm font-normal text-on-surface-variant">min</span></div>
            <p className="font-citation-code text-[11px] text-secondary mt-0.5">City Center Direct</p>
          </div>
          <div className="text-body-sm text-on-surface-variant space-y-1">
            <p className="flex justify-between font-citation-code text-[11px]">
              <span>Peak Frequency:</span>
              <span className="text-on-surface font-telemetry-data">Every 3 mins</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Safety & Night</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">shield</span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-secondary font-bold">-18%</div>
            <p className="font-citation-code text-[11px] text-on-surface-variant mt-0.5">Incident Rate vs City Avg</p>
          </div>
          <div className="text-body-sm text-on-surface-variant space-y-1">
            <p className="flex justify-between font-citation-code text-[11px]">
              <span>Street Lighting:</span>
              <span className="text-secondary font-telemetry-data">Grade A</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Acoustics & Retail</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">graphic_eq</span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold">48 <span className="text-body-sm font-normal text-on-surface-variant">dB</span></div>
            <p className="font-citation-code text-[11px] text-secondary mt-0.5">Quiet Residential Index</p>
          </div>
          <div className="text-body-sm text-on-surface-variant space-y-1">
            <p className="flex justify-between font-citation-code text-[11px]">
              <span>Cafes & Parks:</span>
              <span className="text-on-surface font-telemetry-data">12 cafes | 2 parks</span>
            </p>
          </div>
        </div>
      </div>

      {/* Inline SVG Commute Variance Telemetry Visualizer */}
      <div className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col gap-space-xs mt-auto">
        <div className="flex items-center justify-between">
          <span className="font-citation-code text-citation-code text-on-surface-variant uppercase">Schedule Latency vs Actual Departure Variance</span>
          <span className="font-telemetry-data text-citation-code text-primary">99.2% ON-SCHEDULE</span>
        </div>
        <div className="w-full h-16 flex items-end">
          <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 400 60">
            <line stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.1" x1="0" x2="400" y1="15" y2="15"></line>
            <line stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.1" x1="0" x2="400" y1="35" y2="35"></line>
            <rect fill="currentColor" fillOpacity="0.8" height="36" rx="2" width="16" x="10" y="24"></rect>
            <rect fill="currentColor" fillOpacity="0.9" height="40" rx="2" width="16" x="38" y="20"></rect>
            <rect fill="currentColor" fillOpacity="0.8" height="32" rx="2" width="16" x="66" y="28"></rect>
            <rect fill="currentColor" fillOpacity="0.95" height="42" rx="2" width="16" x="94" y="18"></rect>
            <rect fill="currentColor" fillOpacity="0.85" height="38" rx="2" width="16" x="122" y="22"></rect>
            <rect fill="currentColor" fillOpacity="0.8" height="35" rx="2" width="16" x="150" y="25"></rect>
            <rect fill="#d97707" height="44" rx="2" width="16" x="178" y="16"></rect>
            <rect fill="currentColor" fillOpacity="0.9" height="40" rx="2" width="16" x="206" y="20"></rect>
            <rect fill="currentColor" fillOpacity="0.8" height="36" rx="2" width="16" x="234" y="24"></rect>
            <rect fill="currentColor" fillOpacity="0.85" height="38" rx="2" width="16" x="262" y="22"></rect>
            <rect fill="currentColor" fillOpacity="0.9" height="41" rx="2" width="16" x="290" y="19"></rect>
            <rect fill="currentColor" fillOpacity="0.8" height="34" rx="2" width="16" x="318" y="26"></rect>
            <rect fill="currentColor" fillOpacity="0.9" height="39" rx="2" width="16" x="346" y="21"></rect>
            <rect fill="currentColor" fillOpacity="0.95" height="43" rx="2" width="16" x="374" y="17"></rect>
          </svg>
        </div>
        <div className="flex justify-between font-citation-code text-[10px] text-on-surface-variant font-telemetry-data">
          <span>DAY -14</span>
          <span>DAY -7 [AM PEAK]</span>
          <span className="text-secondary">TODAY</span>
        </div>
      </div>
    </section>
  );
}
