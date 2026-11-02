import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { X, ZoomIn } from 'lucide-react';

interface GalleryHighlightsSectionProps {
  gallery: GalleryItem[];
}

export const GalleryHighlightsSection: React.FC<GalleryHighlightsSectionProps> = ({ gallery }) => {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#101713] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9BE34A] font-extrabold flex items-center gap-1.5 mb-2">
              {/* <span className="w-2 h-2 rounded-full bg-[#9BE34A]" /> */}
              EVENT HIGHLIGHTS & DOKUMENTASI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              MOMEN EMAS & KERINGAT JUARA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Dokumentasi energi para pelari, pembalap sepeda, dan atlet dari berbagai arena kejuaraan yang diselenggarakan oleh KINETIX.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 cursor-pointer shadow-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              
              <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-[#9BE34A]" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BE34A] block">
                  {item.category} · {item.date}
                </span>
                <strong className="text-white text-sm font-semibold line-clamp-1 mt-0.5">
                  {item.title}
                </strong>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center">
              <h4 className="text-white font-bold text-base font-display">{activeImage.title}</h4>
              <span className="text-xs text-[#9BE34A]">{activeImage.category} · {activeImage.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
