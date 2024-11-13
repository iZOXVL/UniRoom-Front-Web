"use client";

import React, { useState, useRef, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useAddRoom from "@/components/Rooms/hooks/useAddRoom";
import { useToast } from "@chakra-ui/react";
import Map from "@/components/Rooms/add-rooms/map";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { FaDollarSign, FaUserGroup, FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  MdOutlineSubtitles,
  MdGroupAdd,
  MdTitle,
  MdOutlinePets,
} from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { reglas, servicios } from "@/components/Rooms/types/rules-services";
import useUploadMedia from "@/components/Rooms/hooks/useUploadImages";
import MediaUploader from "./image-uploader";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import guideSteps from "../types/guide-steps";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface AnimatedButtonProps {
  animationSrc: string | object;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animationSrc,
  label,
  isSelected,
  onClick,
}) => {
  const playerRef = useRef<any>(null); // Ajusta el tipo según la API de DotLottiePlayer

  const handleMouseEnter = () => {
    if (playerRef.current) {
      playerRef.current.play(); // Asegúrate de que 'play' sea un método válido
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current) {
      playerRef.current.pause(); // Asegúrate de que 'pause' sea un método válido
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center h-32 transition-colors duration-200 ${
        isSelected
          ? "border-primary bg-gray-200 dark:border-primary dark:bg-dark"
          : "border-gray-300 dark:bg-dark-2 dark:border-dark-3 hover:border-primary hover:bg-gray-200 dark:hover:border-primary dark:hover:bg-dark"
      }`}
    >
      <DotLottiePlayer
        ref={playerRef}
        src={animationSrc as string | Record<string, unknown>}
        autoplay={false} // Desactiva autoplay
        loop={true} // Ajusta según tus necesidades
        style={{ width: "40px", height: "40px" }}
      />
      <span className="text-sm font-medium mt-2">{label}</span>
    </button>
  );
};

const AddRoomForm = () => {
  const [titulo, setTitulo] = useState("");
  const [price, setPrice] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [minTime, setMinTime] = useState<number | undefined>(undefined);
  const [maxTime, setMaxTime] = useState<number | undefined>(undefined);
  const [allowPets, setAllowPets] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(false);
  const [location, setLocation] = useState<{
    lat: number | undefined;
    lng: number | undefined;
    address: string | undefined;
  }>({
    lat: undefined,
    lng: undefined,
    address: undefined,
  });
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedRules, setSelectedRules] = useState<number[]>([]);
  const { addRoom, isLoading: isAddingRoom } = useAddRoom();
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const { uploadMedia, isLoading: isUploadingMedia } = useUploadMedia();
  const toast = useToast();
  const confetti = useConfettiStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleVideosChange = (newVideos: File[]) => {
    setVideos(newVideos);
  };

  const resetForm = () => {
    setTitulo("");
    setPrice("");
    setDescripcion("");
    setMaxPeople("");
    setMinTime(undefined);
    setMaxTime(undefined);
    setAllowPets(false);
    setSharedStatus(false);
    setLocation({ lat: undefined, lng: undefined, address: undefined });
    setSelectedServices([]);
    setSelectedRules([]);
    setImages([]);
    setVideos([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones previas
    if (images.length === 0 && videos.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, sube al menos una imagen.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!titulo) {
      toast({
        title: "Error",
        description: "El título es obligatorio.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (price === "0" || !price) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a cero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (maxPeople === "0" || !maxPeople) {
      toast({
        title: "Error",
        description: "El número de habitantes debe ser mayor a cero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (minTime === undefined || minTime === 0) {
      toast({
        title: "Error",
        description: "El tiempo de renta mínimo debe ser mayor a cero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (maxTime === undefined || maxTime === 0) {
      toast({
        title: "Error",
        description: "El tiempo de renta máximo debe ser mayor a cero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!descripcion) {
      toast({
        title: "Error",
        description: "La descripción es obligatoria.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (descripcion.length > 250) {
      toast({
        title: "Error",
        description: "La descripción no debe exceder los 250 caracteres.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!location.lat || !location.lng || !location.address) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una ubicación válida en el mapa.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const roomData = {
      titulo,
      descripcion,
      lat: location.lat,
      lng: location.lng,
      address: location.address || "",
      services: selectedServices,
      rules: selectedRules,
      price: parseFloat(price),
      minTime: minTime,
      maxTime: maxTime,
      maxPeople: parseInt(maxPeople, 10),
      sharedStatus,
      allowPets,
    };

    const roomPromise = new Promise(async (resolve, reject) => {
      try {
        const roomId = await addRoom(roomData);
        if (roomId) {
          await uploadMedia(roomId, images, videos);
          resolve(roomId);
          setIsSuccessModalOpen(true);
          confetti.onOpen();
          resetForm();
        } else {
          reject(new Error("Error al crear la habitación."));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(roomPromise, {
      loading: {
        title: "Publicando habitación...",
        description: "Por favor espera mientras se publica la habitación.",
      },
      success: {
        title: "Habitación publicada",
        description: "La habitación se ha publicado exitosamente.",
      },
      error: {
        title: "Error",
        description: "Hubo un problema al publicar la habitación.",
      },
    });
  };

  const handleServiceClick = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((service) => service !== id) : [...prev, id]
    );
  };

  const handleRuleClick = (id: number) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((rule) => rule !== id) : [...prev, id]
    );
  };

  const startGuide = () => {
    const driverObj = driver({
      showProgress: true,
      steps: guideSteps as any,
    });

    driverObj.drive();
  };

  // Generar opciones para los Select de meses (1 a 12)
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} mes${i + 1 > 1 ? "es" : ""}`,
  }));

  return (
    <>
      <Breadcrumb pageName="Publicar habitación" />
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex justify-between items-center">
            <h3 className="font-semibold text-dark dark:text-white">
              Ingresa la información de la habitación
            </h3>
            {/* Botón para iniciar guía de Driver.js */}
            <button
              onClick={startGuide}
              className="bg-primary text-white rounded-md px-4 py-2 hover:bg-opacity-90"
            >
              ¿Cómo llenar este formulario?
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5.5 p-6.5"
          >
            {/* Sección de opciones */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2 mx-auto">
                <label
                  className={`rounded-[10px] border-2 relative flex items-center justify-between cursor-pointer p-4 transition-all duration-200 
                  ${
                    sharedStatus
                      ? "bg-gray-300 border-primary"
                      : "bg-white border-stroke hover:bg-gray-300 hover:border-primary"
                  }
                  dark:bg-dark-2 dark:hover:bg-dark-3 dark:${
                    sharedStatus ? "bg-dark-3 border-primary" : ""
                  }
                `}
                >
                  <input
                    id="step-shared-status"
                    type="checkbox"
                    checked={sharedStatus}
                    onChange={(e) => setSharedStatus(e.target.checked)}
                    className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center space-x-2">
                    <FaUserGroup className="text-primary" />
                    <span className="text-dark dark:text-white font-semibold">
                      Cuarto compartido
                    </span>
                  </div>
                  {sharedStatus && (
                    <span className="text-primary font-bold">✓</span>
                  )}
                </label>
              </div>

              <div className="w-full xl:w-1/2 mx-auto">
                <label
                  className={`rounded-[10px] border-2 relative flex items-center justify-between cursor-pointer p-4 transition-all duration-200
                  ${
                    allowPets
                      ? "bg-gray-300 border-primary"
                      : " bg-white border-stroke hover:bg-gray-300 hover:border-primary"
                  }
                  dark:bg-dark-2 dark:${
                    allowPets ? "bg-dark-3 border-primary" : "hover:bg-dark-3"
                  }
                `}
                >
                  <input
                    id="step-allow-pets"
                    type="checkbox"
                    checked={allowPets}
                    onChange={(e) => setAllowPets(e.target.checked)}
                    className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center space-x-2">
                    <MdOutlinePets className="text-primary" />
                    <span className="text-dark dark:text-white font-semibold">
                      Mascotas permitidas
                    </span>
                  </div>
                  {allowPets && (
                    <span className="text-primary font-bold">✓</span>
                  )}
                </label>
              </div>
            </div>

            {/* Título, Precio y Habitantes */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div id="input-titulo" className="w-full xl:w-4/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <MdTitle className="mr-1 text-primary" />
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el título de la publicación"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                />
              </div>

              <div id="input-precio" className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  {/* Icono de precio */}
                  <span className="mr-1 text-primary">$</span>
                  Precio
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent pl-7 pr-14 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    MXN
                  </span>
                </div>
              </div>

              <div id="input-max-people" className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <MdGroupAdd className="mr-1 text-primary" />
                  Habitantes max
                </label>
                <input
                  type="number"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                />
              </div>
            </div>

            {/* Tiempos de renta */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div id="input-min-time" className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <FaCheck className="mr-1 text-primary" />
                  Tiempo de renta mínimo requerido
                </label>
                <Select
                  id="step-min-time"
                  aria-label="Tiempo de renta mínimo"
                  placeholder="Selecciona meses"
                  size="lg"
                  value={minTime !== undefined ? minTime.toString() : ""}
                  onChange={(e) =>
                    setMinTime(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  classNames={{
                    base: "w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary",
                    trigger: "w-full",
                  }}
                >
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div id="input-max-time" className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <RxCross2 className="mr-1 text-primary" />
                  Tiempo de renta máximo requerido
                </label>
                <Select
                  id="step-max-time"
                  aria-label="Tiempo de renta máximo"
                  placeholder="Selecciona meses"
                  size="lg"
                  value={maxTime !== undefined ? maxTime.toString() : ""}
                  onChange={(e) =>
                    setMaxTime(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  classNames={{
                    base: "w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary",
                    trigger: "w-full",
                  }}
                >
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Descripción y mapa */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div id="input-descripcion" className="w-full xl:w-1/2 ">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center">
                  <MdOutlineSubtitles className="mr-1 text-primary" />
                  Descripción
                </label>
                <textarea
                  placeholder="Ingrese la descripción de la publicación"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={8}
                  maxLength={250}
                  className="w-full h-[288px] rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none dark:active:border-primary"
                />
                <div className="text-right text-gray-500">
                  {descripcion.length}/250 caracteres
                </div>
              </div>
              <div id="map-ubicacion" className="w-full xl:w-1/2">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center ">
                  <IoLocationSharp className="mr-1 text-primary" />
                  Ubicación de la habitación
                </label>
                <Map
                  onSelectLocation={(
                    location: {
                      coords: { lat: number; lng: number };
                      address: string;
                    }
                  ) =>
                    setLocation({
                      lat: location.coords.lat,
                      lng: location.coords.lng,
                      address: location.address,
                    })
                  }
                />
              </div>
            </div>

            {/* Servicios */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div id="services-list" className="w-full xl:w-full">
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Servicios brindados
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                  {servicios.map((servicio) => {
                    const isSelected = selectedServices.includes(servicio.id);
                    return (
                      <AnimatedButton
                        key={servicio.id}
                        animationSrc={servicio.animation}
                        label={servicio.label}
                        isSelected={isSelected}
                        onClick={() => handleServiceClick(servicio.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reglas */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div id="rules-list" className="w-full xl:w-full">
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Reglas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {reglas.map((regla) => {
                    const isSelected = selectedRules.includes(regla.id);
                    return (
                      <AnimatedButton
                        key={regla.id}
                        animationSrc={regla.animation}
                        label={regla.label}
                        
                        isSelected={isSelected}
                        onClick={() => handleRuleClick(regla.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Multimedia */}
            <div
              id="media-uploader"
              className="mb-4.5 flex flex-col gap-6 xl:flex-row"
            >
              <div className="w-full xl:w-full">
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Multimedia
                </label>
                <MediaUploader
                  onImagesChange={handleImagesChange}
                  onVideosChange={handleVideosChange}
                />
              </div>
            </div>

            {/* Botón de publicar */}
            <button
              id="btn-publicar"
              type="submit"
              disabled={isUploadingMedia}
              className="mt-5 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90"
            >
              {isAddingRoom || isUploadingMedia
                ? "Subiendo..."
                : "Publicar habitación"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de éxito */}
      <Modal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Habitación publicada</ModalHeader>
          <ModalBody>
            <p>La habitación se ha publicado exitosamente.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                setIsSuccessModalOpen(false);
              }}
            >
              Subir otra habitación
            </Button>
            <Button
              color="success"
              onPress={() => {
                window.location.replace("/rooms/list-room");
              }}
            >
              Ir a mis habitaciones
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRoomForm;
