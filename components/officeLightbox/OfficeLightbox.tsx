'use client'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Mouse } from '@playwright/test';
import Image from 'next/image';
import React, { useState } from 'react';

const OfficeLightbox: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const images = [
    '/office1.jpeg',
    '/office5.jpeg',
    '/office3.jpeg',
    '/office2.jpeg',
    '/office6.jpeg',
    '/office8.jpeg'
  ];
  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };
  const closeLightbox = () => {
    setSelectedImage(null);
  };
  const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length -1 : prevIndex -1));
    setSelectedImage(images[currentIndex -1 < 0 ? images.length -1 : currentIndex -1]);
  };
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); 
    setCurrentIndex(prevIndex => (prevIndex === images.length -1 ? 0 : prevIndex +1));
    setSelectedImage(images[currentIndex +1 >= images.length ? 0 : currentIndex +1]) 
  }

  return (
    <div className='px-6 pb-24 pt-12 sm:pt-32'>
    <div className='flex flex-col justify-center items-center text-center'>
      <h2 className='text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl'>Coworking copy</h2>
      <p className='mt-4 text-lg leading-8 text-primary-800'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quo quibusdam ipsam aliquid sequi, qui alias. Repellat quasi exercitationem impedit, officia odio veniam pariatur temporibus reprehenderit aspernatur, perferendis soluta quaerat.</p>
    </div>
    <div className='mx-auto my-4 p-4 relative sm:p-4'>
      <div className="flex flex-wrap justify-center items-center gap-1">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Image ${index}`}
            onClick={() => openLightbox(image, index)}
            className="cursor-pointer"
            width={600}
            height={275}
          />
        ))}
      </div>
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
            className="object-contain p-1"/>
          </div>
          <button
          className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-1 text-black'
          onClick={handlePrev}
          >
            <ChevronLeftIcon className='h-8 w-8 p-1' />
          </button>
          <button
          className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-1 text-black'
          onClick={handleNext}
          >
            <ChevronRightIcon className='h-8 w-8 p-1'/>
          </button>
        </div>
      )}
    </div>
  );
};

export default OfficeLightbox;

