'use client'
import Image from 'next/image';
import React, { useState } from 'react';

const OfficeLightbox: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    '/office1.jpeg',
    '/office5.jpeg',
    '/office3.jpeg',
    '/office2.jpeg',
    '/office6.jpeg',
    '/office8.jpeg'
  ];
  const openLightbox = (image: string) => {
    setSelectedImage(image);
  };
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className='mx-auto p-16 relative sm:p-4'>
      <div className="flex flex-wrap justify-center items-center gap-5">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Image ${index}`}
            onClick={() => openLightbox(image)}
            className="cursor-pointer"
            width={600}
            height={275}
          />
        ))}
      </div>

      {/* Render the lightbox when an image is selected */}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80"
          onClick={closeLightbox}
        >
          <div className="max-w-2xl max-h-2xl">
            <Image
            src={selectedImage} 
            alt="Selected Image" 
            fill={true}
            className="object-contain p-2"/>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeLightbox;
