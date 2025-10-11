"use client";

import { useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import {
  FiHeart,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import styles from "../styles.module.scss";
import classNames from "classnames";

interface ProductImageGalleryProps {
  variants: any[];
  selectedColor: string;
  productName: string;
  badge?: string;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export default function ProductImageGallery({
  variants,
  selectedColor,
  productName,
  badge,
  isWishlisted,
  onWishlistToggle,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  // const getColorImages = (color: string): string[] => {
  //   const variant = variants.find((v) => v.color === color);
  //   if (variant?.images && variant.images.length > 0) {
  //     const realImage = variant.images[0];
  //     return [
  //       realImage,
  //       "/default-image.png",
  //       "/default-image.png",
  //       "/default-image.png",
  //     ];
  //   }
  //   return [
  //     "/default-image.png",
  //     "/default-image.png",
  //     "/default-image.png",
  //     "/default-image.png",
  //   ];
  // };
  const getColorImages = (color: string): string[] => {
    const variant = variants.find((v) => v.color === color);
    if (variant?.images && variant.images.length > 0) {
      return variant.images; // Return complete array of images
    }
    // If no images, then fallback to placeholder (4 placeholders to mimic existing length)
    return [
      "/default-image.png",
      "/default-image.png",
      "/default-image.png",
      "/default-image.png",
    ];
  };

  const currentImages = getColorImages(selectedColor);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  const openModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPanX(0);
        setPanY(0);
      }
      return newZoom;
    });
  };

  const navigateModal = (direction: "prev" | "next") => {
    const maxIndex = currentImages.length - 1;
    if (direction === "prev") {
      setModalImageIndex(modalImageIndex > 0 ? modalImageIndex - 1 : maxIndex);
    } else {
      setModalImageIndex(modalImageIndex < maxIndex ? modalImageIndex + 1 : 0);
    }
    resetZoom();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          e.preventDefault();
          navigateModal("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateModal("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isModalOpen, modalImageIndex]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateModal("next");
    } else if (isRightSwipe) {
      navigateModal("prev");
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isModalOpen) return;
    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handleDoubleClick = () => {
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else {
      resetZoom();
    }
  };

  const handleImageTouch = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
      if (zoomLevel === 1) {
        setZoomLevel(2);
      } else {
        resetZoom();
      }
    }
    setLastTap(currentTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newPanX = e.clientX - dragStart.x;
      const newPanY = e.clientY - dragStart.y;

      const maxPanX = (zoomLevel - 1) * 150;
      const maxPanY = (zoomLevel - 1) * 150;

      setPanX(Math.max(-maxPanX, Math.min(maxPanX, newPanX)));
      setPanY(Math.max(-maxPanY, Math.min(maxPanY, newPanY)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [initialPinchDistance, setInitialPinchDistance] = useState<
    number | null
  >(null);
  const [initialZoom, setInitialZoom] = useState(1);

  const getPinchDistance = (touches: React.TouchList | TouchList) => {
    const t0 = (touches as any)[0];
    const t1 = (touches as any)[1];
    return Math.sqrt(
      Math.pow(t1.clientX - t0.clientX, 2) +
        Math.pow(t1.clientY - t0.clientY, 2)
    );
  };

  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialPinchDistance(getPinchDistance(e.touches as any));
      setInitialZoom(zoomLevel);
    }
  };

  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault();
      const currentDistance = getPinchDistance(e.touches as any);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(1, Math.min(4, initialZoom * scale));
      setZoomLevel(newZoom);

      if (newZoom === 1) {
        setPanX(0);
        setPanY(0);
      }
    }
  };

  return (
    <div
      className={classNames(
        "d-block d-md-flex align-items-center flex-row-reverse",
        styles.productImageGallery
      )}
    >
      {/* Image gallery container */}
      <div className="position-relative w-100 image-gallery-container">
        {/* Main Image */}
        <img
          src={currentImages[selectedImage]}
          alt={productName}
          className="img-fluid rounded-4 w-100 main-product-image-style"
          onClick={() => openModal(selectedImage)}
        />
        {/* Badge */}
        {/* {badge && (
          <Badge
            bg={
              badge === "Sale" ? "danger" : badge === "New" ? "success" : "dark"
            }
            className="position-absolute top-0 start-0 m-3 px-3 py-2"
          >
            {badge}
          </Badge>
        )} */}
        {/* Wishlist button */}
        <Button
          variant={isWishlisted ? "danger" : "light"}
          className="position-absolute top-0 end-0 m-3 rounded-circle"
          onClick={onWishlistToggle}
        >
          <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
        </Button>

        {/* Thumbnails */}
        <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center gap-2 p-2 thumbnail-container-style">
          {currentImages.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className={`thumbnail-image-style ${
                selectedImage === index
                  ? "border-dark border-2"
                  : "border-light"
              }`}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={`${styles.imageModal} d-flex align-items-center justify-content-center`}
          onClick={closeModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Close Button */}
          <button
            className={`${styles.modalCloseBtn} d-flex align-items-center justify-content-center`}
            onClick={closeModal}
          >
            <FiX />
          </button>

          {/* Image Counter */}
          <div className={styles.imageCounter}>
            {modalImageIndex + 1} of {currentImages.length}
          </div>

          {/* Prev Button */}
          <button
            className={`${styles.modalNavBtn} ${styles.prevBtn} d-flex align-items-center justify-content-center`}
            onClick={(e) => {
              e.stopPropagation();
              navigateModal("prev");
            }}
          >
            <FiChevronLeft />
          </button>

          {/* Next Button */}
          <button
            className={`${styles.modalNavBtn} ${styles.nextBtn} d-flex align-items-center justify-content-center`}
            onClick={(e) => {
              e.stopPropagation();
              navigateModal("next");
            }}
          >
            <FiChevronRight />
          </button>

          {/* Modal Image */}
          <img
            src={currentImages[modalImageIndex]}
            alt={`${productName} ${modalImageIndex + 1}`}
            className={`${styles.modalImage} ${
              zoomLevel > 1
                ? styles.zoomed
                : zoomLevel === 1
                ? styles.zoomable
                : ""
            }`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
              handlePinchStart(e);
              handleImageTouch(e);
            }}
            onTouchMove={handlePinchMove}
          />
          {/* Zoom controls */}
          <div className={`${styles.zoomControls} d-flex align-items-center`}>
            <button
              className={styles.zoomBtn}
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={zoomLevel <= 1}
            >
              <FiMinus />
            </button>
            <div className={styles.zoomLevel}>
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              className={styles.zoomBtn}
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={zoomLevel >= 4}
            >
              <FiPlus />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
