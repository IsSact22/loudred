// src/components/Captcha.js
"use client";
import { useState } from "react";
import { useData } from "@/src/hooks/useData";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import Image from "next/image";

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
      <h2 className="font-semibold mb-2 justify-center items-center text-center">Selecciona solo los perritos</h2>
      <div className="captcha-images grid grid-cols-3 gap-2">
        {images?.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className={`flex items-center justify-center ${
              selectedImages.has(index)
                ? "border-4 border-blue-500"
                : "border border-red-600"
            }`}
          >
            <Image
              width={500}
              height={500}
              src={image.url}
              alt={`Imagen ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        className="mt-4 p-4  justify-items-center flex bg-green-500 hover:bg-green-700 text-white rounded"
      >
        Verificar
      </Button>
    </div>
  );
}
