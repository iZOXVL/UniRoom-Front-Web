import { useState, ChangeEvent, DragEvent } from "react";
import { useToast } from "@chakra-ui/react";

interface MediaUploaderProps {
  onImagesChange: (newImages: File[]) => void;
  onVideosChange: (newVideos: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onImagesChange, onVideosChange }) => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const toast = useToast();

  const handleMediaChange = (files: File[], type: "image" | "video") => {
    if (type === "image") {
      if (images.length + files.length > 4) {
        toast({
          title: "Límite alcanzado",
          description: "No puedes subir más de 4 imágenes.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newImages = [...images, ...files];
      setImages(newImages);
      onImagesChange(newImages);
    } else {
      if (videos.length + files.length > 2) {
        toast({
          title: "Límite alcanzado",
          description: "No puedes subir más de 2 videos.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newVideos = [...videos, ...files];
      setVideos(newVideos);
      onVideosChange(newVideos);
    }
  };

  const handleRemoveFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
    } else {
      const newVideos = videos.filter((_, i) => i !== index);
      setVideos(newVideos);
      onVideosChange(newVideos);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: "image" | "video") => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleMediaChange(files, type);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Upload Area for Images */}
      <div
        className="cursor-pointer p-6 flex flex-col justify-center items-center bg-white dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border-2 border-stroke rounded-xl"
        onDrop={(e) => handleDrop(e, "image")}
        onDragOver={handleDragOver}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
        <div className="text-center">
          <div className="mt-2 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 dark:text-white">Suelta tus imágenes aquí o</span>
            <label className="bg-transparent font-bold text-primary rounded-lg cursor-pointer decoration-2 hover:underline">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMediaChange(Array.from(e.target.files || []), "image")}
                className="hidden"
              />
              explora
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">Elige tus imágenes (máximo 4).</p>
        </div>
      </div>

      {/* Upload Area for Videos */}
      <div
        className="cursor-pointer p-6 flex flex-col justify-center items-center bg-white  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border-2 border-stroke rounded-xl"
        onDrop={(e) => handleDrop(e, "video")}
        onDragOver={handleDragOver}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
        <div className="text-center">
          <div className="mt-2 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 dark:text-white">Suelta tus vídeos aquí o</span>
            <label className="bg-transparent font-bold text-primary rounded-lg cursor-pointer decoration-2 hover:underline">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => handleMediaChange(Array.from(e.target.files || []), "video")}
                className="hidden"
              />
              explora
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">Elige tus videos(máximo 2).</p>
        </div>
      </div>

      {/* Previews for Images */}
      <div className="mt-4 space-y-2 col-span-1">
        {images.map((image, index) => (
          <div key={index} className="p-3 bg-white border  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white  border-solid border-gray-300 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <img src={URL.createObjectURL(image)} alt={`Imagen ${index + 1}`} className="w-10 h-10 object-cover rounded-lg" />
              <div>
                <p className="text-sm font-medium dark:text-white text-gray-800">{image.name}</p>
                <p className="text-xs dark:text-gray-5 text-gray-500">{(image.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(index, "image")}
              className="text-gray-500 hover:text-gray-800 dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Previews for Videos */}
      <div className="mt-4 space-y-2 col-span-1">
        {videos.map((video, index) => (
          <div key={index} className="p-3 bg-white dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white  border border-solid border-gray-300 rounded-xl flex justify-between items-center">
            <video src={URL.createObjectURL(video)} className="w-10 h-10 object-cover rounded-lg" controls />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{video.name}</p>
              <p className="text-xs dark:text-gray-5  text-gray-500">{(video.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(index, "video")}
              className="text-gray-500 hover:text-gray-800 dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
