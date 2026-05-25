import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for infinite scroll/lazy loading functionality
 * Uses IntersectionObserver API for optimal performance
 *
 * @param {Function} fetchMore - Callback function to fetch more data
 * @param {boolean} isLoading - Whether data is currently loading
 * @param {boolean} hasMore - Whether there's more data to load
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} - ref to attach to trigger element and loading state
 */
export const useInfiniteScroll = (
    fetchMore,
    isLoading = false,
    hasMore = true,
    options = { threshold: 0.1, rootMargin: '100px' }
) => {
    const triggerRef = useRef(null);
    const [isTriggered, setIsTriggered] = useState(false);

    const handleIntersection = useCallback(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !isLoading && hasMore && !isTriggered) {
                setIsTriggered(true);
                fetchMore();
            }
        },
        [fetchMore, isLoading, hasMore, isTriggered]
    );

    useEffect(() => {
        setIsTriggered(false);
    }, [isLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, options);
        const currentTrigger = triggerRef.current;

        if (currentTrigger) {
            observer.observe(currentTrigger);
        }

        return () => {
            if (currentTrigger) {
                observer.unobserve(currentTrigger);
            }
        };
    }, [handleIntersection, options]);

    return { triggerRef };
};

export default useInfiniteScroll;

