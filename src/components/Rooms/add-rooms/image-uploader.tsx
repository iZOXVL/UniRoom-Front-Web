import { useState, ChangeEvent } from "react";
import { useToast } from "@chakra-ui/react";

interface ImageUploaderProps {
  onImagesChange: (newImages: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<File[]>([]);
  const toast = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      toast({
        title: "Límite alcanzado",
        description: "No puedes subir más de 4 imágenes.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return; // Evitamos añadir más imágenes.
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="border border-gray-300 rounded p-2"
        disabled={images.length >= 4} // Deshabilitar si ya hay 4 imágenes.
      />

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`Imagen ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveImage(index);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
