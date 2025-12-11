"use client";

import { useRef, useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  name: string;
  photo: string;
  quote: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    
    // Faster speed on mobile (2x), normal on desktop
    const isMobile = window.innerWidth < 768;
    const scrollSpeed = isMobile ? 0.6 : 0.3; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset scroll position when we've scrolled past the first set
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= halfWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden py-4"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-[300px] sm:w-[350px]"
          >
            <TestimonialCard
              name={testimonial.name}
              photo={testimonial.photo}
              quote={testimonial.quote}
              rating={testimonial.rating}
            />
          </div>
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          Paused - hover to read
        </div>
      )}
    </div>
  );
}

