// src/components/Captcha.js
"use client";
import { useState } from "react";
import { useData } from "@/src/hooks/useData";
import { toast } from 'react-hot-toast';

export default function Captcha({ onSuccess }) {
  const [selectedImages, setSelectedImages] = useState(new Set());
  const { data = [], isLoading } = useData("/captcha", {});
  const images = data?.images || [];

  const handleImageClick = (index) => {
    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(index)
        ? newSelected.delete(index)
        : newSelected.add(index);
      return newSelected;
    });
  };

  const handleSubmit = () => {
    const totalDogs = images.filter((img) => img.isDog).length;
    const correctSelections = images.filter(
      (img, idx) => img.isDog && selectedImages.has(idx)
    ).length;

    correctSelections === totalDogs
      ? toast.success("¡Correcto! 🐶") && onSuccess()
      : toast.error("Selecciona solo los perros.");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-center w-full h-auto bg-black/10">
        <span className="accessLoader"></span>
      </div>
    );
  }

  return (
    <div className="captcha">
      <h2>Selecciona los perritos :3</h2>
      <div className="captcha-images grid grid-cols-3 gap-2">
        {images?.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className={`border border-red-600 flex items-center justify-center ${
              selectedImages.has(index) ? "border-4 border-blue-500" : ""
            }`}
          >
            <img
              src={image.url}
              alt={`Imagen ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 p-4 bg-green-500 text-white rounded"
      >
        Verificar
      </button>
    </div>
  );
}
