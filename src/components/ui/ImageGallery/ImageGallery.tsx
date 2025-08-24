'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Image as ImageType } from '@/types/database';
import Button from '@/components/ui/Button';
import { createPortal } from 'react-dom';

interface ImageGalleryProps {
  images: ImageType[];
  siteName: string;
  maxPreviewCount?: number;
  className?: string;
}

interface ImageModalProps {
  images: ImageType[];
  currentIndex: number;
  siteName: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  siteName,
  onClose,
  onPrevious,
  onNext,
}) => {
  const { t } = useTranslation('infoPanel');
  const currentImage = images[currentIndex];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onPrevious();
    } else if (e.key === 'ArrowRight') {
      onNext();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center cursor-pointer"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        {/* Close button - ИСПРАВЛЕНО */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="
            absolute top-4 right-4 z-50
            w-10 h-10 rounded-full
            bg-black/60 hover:bg-black/80 backdrop-blur-sm
            text-white hover:text-white
            border-2 border-white/20 hover:border-white/40
            flex items-center justify-center
            transition-all duration-300 ease-out
            text-2xl font-bold leading-none
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-white/50
            cursor-pointer pointer-events-auto
          "
          aria-label={t('gallery.closeModal')}
        >
          ×
        </button>

        {/* Navigation buttons - ИСПРАВЛЕНО ПОЗИЦИОНИРОВАНИЕ */}
        {images.length > 1 && (
          <>
            {/* Кнопка "Предыдущая" - слева по центру */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="
                absolute left-4 top-1/2 transform -translate-y-1/2 z-40
                w-12 h-12 rounded-full
                bg-black/60 hover:bg-black/80 backdrop-blur-sm
                text-white hover:text-white
                border-2 border-white/20 hover:border-white/40
                flex items-center justify-center
                transition-all duration-300 ease-out
                text-3xl font-bold leading-none
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-white/50
                hover:scale-110
                cursor-pointer pointer-events-auto
              "
              aria-label={t('gallery.previousImage')}
            >
              ‹
            </button>

            {/* Кнопка "Следующая" - справа по центру, НЕ конфликтует с кнопкой закрытия */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="
                absolute right-4 top-1/2 transform -translate-y-1/2 z-40
                w-12 h-12 rounded-full
                bg-black/60 hover:bg-black/80 backdrop-blur-sm
                text-white hover:text-white
                border-2 border-white/20 hover:border-white/40
                flex items-center justify-center
                transition-all duration-300 ease-out
                text-3xl font-bold leading-none
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-white/50
                hover:scale-110
                cursor-pointer pointer-events-auto
              "
              aria-label={t('gallery.nextImage')}
            >
              ›
            </button>
          </>
        )}

        {/* Image */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full flex items-center justify-center pointer-events-auto cursor-default"
        >
          <Image
            src={currentImage.url}
            alt={`${siteName} - Image ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain pointer-events-none"
            priority
          />
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm pointer-events-none z-30">
            {t('gallery.imageCounter', { current: currentIndex + 1, total: images.length })}
          </div>
        )}
      </div>
    </div>
  );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  siteName,
  maxPreviewCount = 3,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Cleanup: восстанавливаем прокрутку при размонтировании
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const previewImages = images.slice(0, maxPreviewCount);
  const hiddenCount = images.length - maxPreviewCount;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    // Блокируем прокрутку body
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Восстанавливаем прокрутку body
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {previewImages.map((image, index) => (
          <div
            key={image.id}
            className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openModal(index)}
          >
            <Image
              src={image.url}
              alt={`${siteName} - Image ${index + 1}`}
              width={400}
              height={225}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}

        {hiddenCount > 0 && (
          <div
            className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            onClick={() => openModal(maxPreviewCount)}
          >
            <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
              +{hiddenCount}
            </div>
          </div>
        )}
      </div>

      {isModalOpen &&
        mounted &&
        createPortal(
          <ImageModal
            images={images}
            currentIndex={currentImageIndex}
            siteName={siteName}
            onClose={closeModal}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />,
          document.body,
        )}
    </>
  );
};
