"use client";

import React, { useEffect, useState, useRef } from "react";
import { reglas, servicios } from "@/components/Rooms/types/rules-services";
import { useSearchParams } from "next/navigation";
import useGetRoomDetails from "@/components/Rooms/hooks/useGetRoomDetails";
import { useToast } from "@chakra-ui/toast";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { driver } from "driver.js";
import MapEdit from "@/components/Rooms/edit-room/map-edit";
import "driver.js/dist/driver.css";
import guideSteps from "../types/guide-steps";
import { FaCheck, FaUserGroup } from "react-icons/fa6";
import {
  MdGroupAdd,
  MdOutlinePets,
  MdOutlineSubtitles,
  MdTitle,
} from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoLocationSharp } from "react-icons/io5";
import { DotLottiePlayer } from "@dotlottie/react-player";
import MediaUploader from "../add-rooms/image-uploader";
import useEditRoom from "../hooks/useEditRoom";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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
  const playerRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current) {
      playerRef.current.pause();
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
        autoplay={false}
        loop={true}
        style={{ width: "40px", height: "40px" }}
      />
      <span className="text-sm font-medium mt-2">{label}</span>
    </button>
  );
};

const EditRoomForm = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const numericRoomId = roomId ? parseInt(roomId, 10) : null;
  const [titulo, setTitulo] = useState("");
  const [price, setPrice] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const { editRoom } = useEditRoom();
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
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const toast = useToast();

  // Estado de carga para el MultiStepLoader
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estado para el modal de éxito
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Define los pasos del loader
  const loadingStates = [
    { text: "Validando datos" },
    { text: "Actualizando habitación" },
    { text: "Finalizando" },
  ];

  // Llamamos al hook con el roomId numérico
  const { roomDetails, loading: loadingDetails, error } = useGetRoomDetails(
    numericRoomId
  );

  // Efecto para cargar los datos en los campos cuando roomDetails cambie
  useEffect(() => {
    if (roomDetails) {
      setTitulo(roomDetails.title || "");
      setPrice(roomDetails.price.toString() || "");
      setDescripcion(roomDetails.description || "");
      setMaxPeople(roomDetails.maxPeople.toString() || "");
      setMinTime(roomDetails.minTime.toString() || "");
      setMaxTime(roomDetails.maxTime.toString() || "");
      setAllowPets(roomDetails.allowPets || false);
      setSharedStatus(roomDetails.sharedStatus || false);
      setLocation({
        lat: roomDetails.latitude,
        lng: roomDetails.longitude,
        address: roomDetails.address,
      });

      // Mapea los IDs de featuresDto y roomRulesDto para cargar los servicios y reglas seleccionados
      setSelectedServices(
        roomDetails.featuresDto?.map((service) => service.featureId) || []
      );
      setSelectedRules(
        roomDetails.roomRulesDto?.map((rule) => rule.ruleId) || []
      );
    }
  }, [roomDetails]);

  const isDisabled = true;

  if (loadingDetails)
    return <div>Cargando detalles de la habitación...</div>;
  if (error) return <div>Error al cargar los detalles de la habitación.</div>;

  const handleServiceClick = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((service) => service !== id)
        : [...prev, id]
    );
  };

  const handleRuleClick = (id: number) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((rule) => rule !== id) : [...prev, id]
    );
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleVideosChange = (newVideos: File[]) => {
    setVideos(newVideos);
  };

  const id = roomId ? parseInt(roomId, 10) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones previas
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

    if (minTime === "0" || !minTime) {
      toast({
        title: "Error",
        description: "El tiempo de renta mínimo debe ser mayor a cero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (maxTime === "0" || !maxTime) {
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

    if (!location.lat || !location.lng || !location.address) {
      toast({
        title: "Error",
        description:
          "Por favor, selecciona una ubicación válida en el mapa.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const roomData = {
      titulo,
      id,
      descripcion,
      lat: location.lat,
      lng: location.lng,
      address: location.address || "",
      services: selectedServices,
      rules: selectedRules,
      price: parseFloat(price),
      minTime: parseInt(minTime, 10),
      maxTime: parseInt(maxTime, 10),
      maxPeople: parseInt(maxPeople, 10),
      sharedStatus,
      allowPets,
    };

    console.log("roomData", roomData);

    // Inicia el loader
    setLoading(true);
    setCurrentStep(0);

    try {
      // Paso 1: Validando datos
      setCurrentStep(0);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Paso 2: Actualizando habitación
      setCurrentStep(1);
      const response = await editRoom(roomData);

      if (!response) {
        throw new Error("Error al editar la habitación.");
      }

      // Paso 3: Subiendo multimedia (si hay nuevas imágenes o videos)
      setCurrentStep(2);
      // Aquí puedes implementar la lógica para subir multimedia si es necesario

      // Paso 4: Finalizando
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Muestra modal de éxito
      setIsSuccessModalOpen(true);

      // Muestra toast de éxito
      toast({
        title: "Éxito",
        description: "La habitación se ha editado exitosamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      // Muestra toast de error
      toast({
        title: "Error",
        description: "Hubo un problema al editar la habitación.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      // Finaliza el loader
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const startGuide = () => {
    const driverObj = driver({
      showProgress: true,
      steps: guideSteps as any,
    });
    driverObj.drive();
  };

  return (
    <>
      {/* Muestra el MultiStepLoader cuando loading es true */}
      {loading && (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={loading}
          currentStep={currentStep}
        />
      )}

      <Breadcrumb pageName="Editar habitación" />
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex justify-between items-center">
            <h3 className="font-semibold text-dark dark:text-white">
              Actualiza la información de la habitación
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
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                />
              </div>

              <div id="input-precio" className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
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
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
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
                <div className="relative">
                  <input
                    type="number"
                    value={minTime}
                    onChange={(e) => setMinTime(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    meses
                  </span>
                </div>
              </div>

              <div id="input-max-time" className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <RxCross2 className="mr-1 text-primary" />
                  Tiempo de renta máximo requerido
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    meses
                  </span>
                </div>
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
                  className="w-full h-[288px] rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none dark:active:border-primary"
                />
              </div>
              <div id="map-ubicacion" className="w-full xl:w-1/2">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center">
                  <IoLocationSharp className="mr-1 text-primary" />
                  Ubicación de la habitación
                </label>
                <div
                  className={`relative ${
                    isDisabled ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <MapEdit
                    onSelectLocation={setLocation}
                    initialLocation={{
                      latitude: location.lat,
                      longitude: location.lng,
                      address: location.address,
                    }}
                  />
                </div>
                {isDisabled && (
                  <p className="text-small text-default-500">
                    La opción de editar la ubicación de la habitación está
                    deshabilitada.
                  </p>
                )}
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
            <div>
              <div
                id="media-uploader"
                className={`mb-4.5 flex flex-col gap-6 xl:flex-row ${
                  isDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
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
              {isDisabled && (
                <p className="text-small text-default-500 mt-[-2rem]">
                  La opción de editar multimedia está deshabilitada.
                </p>
              )}
            </div>

            {/* Botón de editar */}
            <button
              id="btn-publicar"
              type="submit"
              disabled={loading}
              className="mt-5 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90"
            >
              {loading ? "Editando habitación..." : "Editar habitación"}
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
          <ModalHeader>Habitación actualizada</ModalHeader>
          <ModalBody>
            <p>La habitación se ha actualizado exitosamente.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                setIsSuccessModalOpen(false);
              }}
            >
              Cerrar
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

export default EditRoomForm;
