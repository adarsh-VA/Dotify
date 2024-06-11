import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function CustomScrollY({ componentRef, customClasses }) {

  var scrollContentRef = componentRef;
  var customScrollbarThumb = useRef(null);
  var customScrollBar = useRef(null);
  const location = useLocation();
  var [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    customScrollbarThumb.current.style.transform = `translateY(${0}px)`;
    scrollContent.scrollTop = 0;
    if (scrollContent) {
      const handleScroll = () => {
        // Calculate the scroll percentage
        const scrollPercentage = (scrollContent.scrollTop / (scrollContent.scrollHeight - scrollContent.clientHeight)) * 100;

        // Calculate the position of the custom scrollbar thumb
        const thumbPosition = (scrollContent.clientHeight - customScrollbarThumb.current.clientHeight) * (scrollPercentage / 100);

        // Position the custom scrollbar thumb
        customScrollbarThumb.current.style.transform = `translateY(${thumbPosition}px)`;
      };

      const handleResize = () => {
        if (scrollContent.scrollHeight <= scrollContent.clientHeight) {
          setShowScroll(false);
        }
        else {
          setShowScroll(true);
        }
      }
      // Attach the scroll event listener when the component mounts
      scrollContent.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      // Clean up the event listener when the component unmounts
      return () => {
        scrollContent.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    customScrollbarThumb.current.style.transform = `translateY(${0}px)`;
    scrollContent.scrollTop = 0;
  }, [location])

  return (
    <div id="custom-scrollbar" className={`absolute right-0 top-0 w-[12px] z-10 h-full ${customClasses} ${showScroll ? '' : 'hidden'}`} ref={customScrollBar}>
      <div id="custom-scrollbar-thumb" className='w-full h-[50%] bg-zinc-400 cursor-pointer opacity-30' ref={customScrollbarThumb}></div>
    </div>
  )
}
