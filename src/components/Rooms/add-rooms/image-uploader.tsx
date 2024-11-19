import React, { useState, DragEvent } from "react";
import { useToast } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: string;
  file: File;
}

interface MediaUploaderProps {
  onImagesChange: (newImages: File[]) => void;
  onVideosChange: (newVideos: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onImagesChange,
  onVideosChange,
}) => {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const toast = useToast();

  const generateId = (file: File) => {
    return `${file.name}-${file.lastModified}-${Math.random()}`;
  };

  const handleMediaChange = (files: File[], type: "image" | "video") => {
    const newMediaItems: MediaItem[] = files.map((file) => ({
      id: generateId(file),
      file,
    }));

    if (type === "image") {
      if (images.length + newMediaItems.length > 4) {
        toast({
          title: "Límite alcanzado",
          description: "No puedes subir más de 4 imágenes.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newImages = [...images, ...newMediaItems];
      setImages(newImages);
      onImagesChange(newImages.map((item) => item.file));
    } else {
      if (videos.length + newMediaItems.length > 2) {
        toast({
          title: "Límite alcanzado",
          description: "No puedes subir más de 2 videos.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newVideos = [...videos, ...newMediaItems];
      setVideos(newVideos);
      onVideosChange(newVideos.map((item) => item.file));
    }
  };

  const handleRemoveFile = (id: string, type: "image" | "video") => {
    if (type === "image") {
      const newImages = images.filter((item) => item.id !== id);
      setImages(newImages);
      onImagesChange(newImages.map((item) => item.file));
    } else {
      const newVideos = videos.filter((item) => item.id !== id);
      setVideos(newVideos);
      onVideosChange(newVideos.map((item) => item.file));
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    type: "image" | "video"
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleMediaChange(files, type);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputClick = (type: "image" | "video") => {
    const fileInput =
      type === "image"
        ? document.getElementById("image-input")
        : document.getElementById("video-input");
    fileInput?.click();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Área de carga para imágenes */}
      <div
        className="cursor-pointer p-6 flex flex-col justify-center items-center bg-white dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border-2 border-stroke rounded-xl"
        onDrop={(e) => handleDrop(e, "image")}
        onDragOver={handleDragOver}
        onClick={() => handleFileInputClick("image")}
      >
        {/* Icono */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div className="text-center">
          <div className="mt-2 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 dark:text-white">
              Suelta tus imágenes aquí o
            </span>
            <label className="bg-transparent font-bold text-primary rounded-lg cursor-pointer decoration-2 hover:underline">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handleMediaChange(Array.from(e.target.files || []), "image")
                }
                className="hidden"
                id="image-input"
              />
              explora
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Elige tus imágenes (máximo 4).
          </p>
        </div>
      </div>

      {/* Área de carga para videos */}
      <div
        className="cursor-pointer p-6 flex flex-col justify-center items-center bg-white  dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border-2 border-stroke rounded-xl"
        onDrop={(e) => handleDrop(e, "video")}
        onDragOver={handleDragOver}
        onClick={() => handleFileInputClick("video")}
      >
        {/* Icono */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div className="text-center">
          <div className="mt-2 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 dark:text-white">
              Suelta tus vídeos aquí o
            </span>
            <label className="bg-transparent font-bold text-primary rounded-lg cursor-pointer decoration-2 hover:underline">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) =>
                  handleMediaChange(Array.from(e.target.files || []), "video")
                }
                className="hidden"
                id="video-input"
              />
              explora
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Elige tus videos (máximo 2).
          </p>
        </div>
      </div>

      {/* Previsualizaciones de imágenes */}
      <div className="mt-4 space-y-2 col-span-1">
        <AnimatePresence>
          {images.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-white border dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border-solid border-gray-300 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-x-3">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt={`Imagen ${item.file.name}`}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm font-medium dark:text-white text-gray-800">
                    {item.file.name}
                  </p>
                  <p className="text-xs dark:text-gray-5 text-gray-500">
                    {(item.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(item.id, "image")}
                className="text-gray-500 hover:text-gray-800 dark:text-white"
              >
                {/* Icono de eliminación */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Previsualizaciones de videos */}
      <div className="mt-4 space-y-2 col-span-1">
        <AnimatePresence>
          {videos.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-white dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:text-white border border-solid border-gray-300 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-x-3">
                <video
                  src={URL.createObjectURL(item.file)}
                  className="w-10 h-10 object-cover rounded-lg"
                  controls
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {item.file.name}
                  </p>
                  <p className="text-xs dark:text-gray-5  text-gray-500">
                    {(item.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(item.id, "video")}
                className="text-gray-500 hover:text-gray-800 dark:text-white"
              >
                {/* Icono de eliminación */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MediaUploader;
