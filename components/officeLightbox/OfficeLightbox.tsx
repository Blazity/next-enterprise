/* eslint-disable react/no-unescaped-entities */
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
    setSelectedImage(images[currentIndex +1 >= images.length ? 0 : currentIndex +1]); 
  };

  return (
  <div className='md:px-60 lg:px-72 xl:px-96 pt-10'>
    <div className='text-center'>
      <h2 className='text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl'>Looking for office space?<br/> we have you covered!</h2>
      <p className='mt-4 text-lg leading-8 text-primary-800'>Explore a practical coworking space in the heart of Antwerp's Kammenstraat. Our cozy office setup is designed for productivity, offering a limited number of spots. Secure your place in the city center and be part of a workspace that balances comfort and inspiration.</p>
      <div className='mt-10 flex'>
      <a href='/contact' className='text-sm font-semibold leading-6 text-primary-800 mx-8'>Contact us for availability<span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div className='my-4 p-4 relative sm:p-4 md:p-0 lg:p-0 xl:p-0 2xl:p-0 h-auto'>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-1">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Image ${index}`}
            onClick={() => openLightbox(image, index)}
            className="cursor-pointer h-36 border rounded-lg border-primary-50"
            width={600}
            height={400}
          />
        ))}
      </div>
    </div>

    {selectedImage && (
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70"
        onClick={closeLightbox}
      >
        <div className="max-w-2xl max-h-2xl">
          <Image
          src={selectedImage} 
          alt="Selected Image" 
          fill={true}
          className="object-contain px-1"/>
        </div>
        <button
          className='absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 rounded-full p-1 text-primary-500'
          onClick={handlePrev}
        >
          <ChevronLeftIcon className='h-8 w-8 p-1' />
        </button>
        <button
          className='absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 rounded-full p-1 text-primary-500'
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
