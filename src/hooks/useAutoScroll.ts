import { useEffect, useState } from 'react';

export function useAutoScroll(dependencies: any[]) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // Check if user is at bottom of page
  const checkIfAtBottom = () => {
    const threshold = 100; // 100px threshold for "near bottom"
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
  };

  // Handle scroll events
  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    setShouldAutoScroll(atBottom);
  };

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (shouldAutoScroll) {
      setIsScrolling(true);
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      
      // Clear scrolling state after a short delay
      const timer = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, dependencies);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    isAtBottom,
    shouldAutoScroll,
    isScrolling,
    scrollToBottom: () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      setShouldAutoScroll(true);
    }
  };
}