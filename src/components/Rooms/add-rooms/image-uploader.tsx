import { useState, ChangeEvent } from "react";
import { useToast } from "@chakra-ui/react";

interface MediaUploaderProps {
  onImagesChange: (newImages: File[]) => void;
  onVideosChange: (newVideos: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onImagesChange, onVideosChange }) => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const toast = useToast();

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = Array.from(e.target.files || []);

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

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    onVideosChange(newVideos);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleMediaChange(e, "image")}
        className="border border-gray-300 rounded p-2"
        disabled={images.length >= 4}
      />
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleMediaChange(e, "video")}
        className="border border-gray-300 rounded p-2"
        disabled={videos.length >= 2}
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

      <div className="grid grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="relative">
            <video
              src={URL.createObjectURL(video)}
              className="w-full h-32 object-cover rounded"
              controls
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveVideo(index);
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

export default MediaUploader;
