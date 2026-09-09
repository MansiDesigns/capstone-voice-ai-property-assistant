"use client";

export interface Property {
  id: string;
  rent_amount: number;
  bhk: string;
  sqft: number;
  society: string;
  furnished: boolean;
  gated: boolean;
}

interface PropertyCardProps {
  property: Property;
  onBookVisit: (id: string) => void;
  index: number;
}

const PLACEHOLDER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBXxBLeQ1M0blxj2LrT5ZuesRuzj_35Em9c2P7nGmV6FtNWy7D1QCyg8psjAeqIi-B30NTj3fUTJ8XKaT-1ocnWmRWUaGjVW01EBezonf9V9gimTpvErAPcdQWP6w5PCXFWIYrSTv26qLgRTl5mR3WAeV4Dm4sjso34hWjKycgG3nq8sIdHNGp3L4j11D8puQ8HXk8rxzikbAWq1tW4ps6kLS2cW-IujclSxwKAszIN1EhavEf3rQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7quLMw6w6jo7Y3aQWosfoHbzJUNYrtkw7eHlJFJU2z39p5gGPmWeSx79U5w4xstQoVlnYX2wyhp899A5Rcq-0ip0eYMJvqaCWG62-mlCngWQCj2-2xJHc28cWHphqtv32ZaqOUydJpY3p0g07HYRPbHv9j5G9qvjs86fpJOOmO1dx7YoUr9fizYHw5O4nw2qeMM4YWKHQP2ow2ygpx3ly5cNuV8FrSAlX2lmlIjXjIZ0XjFWwbg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDitQOsEB2xaX0xwalVWoWRunS_khTocFo4JthzORE7ULkewXeavO2_SgJpxe7-5RgtNuk6b1hVu31cWTjPZsZ5eH2mNuUGZZlwYPWMgZ44o12oTTH1cdBY4OZFBRpDKGI888v6n343i9SWPBOlbiFjihL-0-pWcwKNuDbItXQy77Nwaq_-IHI3NaX7nPQ-BeSz8lOOOblDUq-X6Imbe8rnQQ9cicXsmMm9h1CEl8qvl1xOYAZMhA"
];

export default function PropertyCard({ property, onBookVisit, index }: PropertyCardProps) {
  const imageSrc = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  
  return (
    <article className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px] group relative">
      {index === 0 && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container z-10"></div>
      )}
      <div>
        <div className="relative w-full h-56 overflow-hidden bg-surface-container-highest">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src={imageSrc}
            alt="Property Thumbnail"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-black/40"></div>
          
          <div className="absolute top-space-sm left-space-sm flex flex-wrap gap-space-2xs items-center">
            {index === 0 && (
              <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary font-label-md text-label-md font-bold shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">event_available</span>
                Top Recommendation
              </span>
            )}
            <span className="px-space-xs py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant font-citation-code text-citation-code">
              ID #{property.id}
            </span>
          </div>

          <div className="absolute top-space-sm right-space-sm bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-lg text-right">
            <span className={`font-headline-sm text-headline-sm font-bold ${index === 0 ? 'text-secondary' : 'text-primary'}`}>
              {100 - index * 4}%
            </span>
            <span className="block font-citation-code text-[10px] text-on-surface-variant uppercase">Match Score</span>
          </div>

          <div className="absolute bottom-space-sm left-space-sm right-space-sm">
            <span className="font-citation-code text-citation-code text-primary uppercase font-bold tracking-wider">
              {property.society || 'Independent Building'}
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug truncate">
              {property.bhk} BHK Apartment
            </h3>
          </div>
        </div>

        <div className="p-space-md flex flex-col gap-space-md">
          <div className="flex items-baseline justify-between pb-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-display-hero text-headline-lg font-bold text-on-surface tracking-tight">
                ₹{property.rent_amount.toLocaleString('en-IN')}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">/mo</span>
            </div>
            <div className="flex items-center gap-space-xs text-citation-code text-on-surface-variant font-telemetry-data">
              <span>{property.bhk} BHK</span>
              <span>•</span>
              <span>{property.sqft || 'N/A'} sq ft</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-space-2xs">
            <span className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-citation-code text-citation-code flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">chair</span> {property.furnished ? 'Furnished' : 'Semi-Furnished'}
            </span>
            {property.gated && (
              <span className="px-space-xs py-1 rounded bg-surface-container-high text-secondary font-citation-code text-citation-code flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">shield</span> Gated
              </span>
            )}
            <span className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-citation-code text-citation-code flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">ac_unit</span> Central A/C
            </span>
            <span className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-citation-code text-citation-code flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">pedal_bike</span> Bike Storage
            </span>
          </div>

          <div className="bg-surface-container rounded-lg p-space-sm flex flex-col gap-space-2xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span> Scout Reasoning Vector
              </span>
              <span className={`font-citation-code text-[11px] ${index === 0 ? 'text-secondary' : 'text-primary'}`}>
                {index === 0 ? 'Optimal Delta' : 'Budget Winner'}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              <strong className="text-on-surface font-medium">Why Picked:</strong> Direct match for user constraints. Rent is within limit. Good layout and structural integrity.
            </p>
          </div>
        </div>
      </div>

      <div className="p-space-md pt-0 flex items-center gap-space-xs">
        <button 
          onClick={() => onBookVisit(property.id)}
          className={`flex-1 py-space-xs px-space-sm rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md ${
            index === 0 
              ? 'bg-primary text-on-primary hover:bg-primary-container' 
              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
          }`}
        >
          {index === 0 ? (
            <><span className="material-symbols-outlined text-[16px]">calendar_today</span> Tour Confirmed (2 PM)</>
          ) : (
            <><span className="material-symbols-outlined text-[16px]">add_circle</span> Add To Tour Route</>
          )}
        </button>
        <button className="p-space-xs rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors" title="Listen to 30s Audio Briefing">
          <span className="material-symbols-outlined text-[20px] text-primary">volume_up</span>
        </button>
      </div>
    </article>
  );
}
