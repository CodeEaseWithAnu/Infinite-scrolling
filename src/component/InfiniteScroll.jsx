import React, { useEffect, useRef, useState } from 'react';


const InfiniteScroll = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);

  
  const fetchImages = async () => {
    const response =
     await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`);
    const data = await response.json();
    setImages((prevImages) => [...prevImages, ...data]);
  };

  //Initial fetch
  useEffect(() => {
    fetchImages();
  }, []);

  // Intersection Observer to load more images
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef]);

  // Load more images when the page changes
  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="h-40 w-full my-5 bg-gray-200 
        flex items-center justify-center">
          <img src={image.download_url} alt={image.author} 
          className="h-full object-cover" />
        </div>
      ))}
      <div ref={loadingRef} className="text-center mt-5">
        <p className="text-gray-600">Loading more images...</p>
      </div>
    </div>
  );
};

export default InfiniteScroll;
