"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import useAddRoom from "@/components/Rooms/hooks/useAddRoom";
import uploadImages from "@/components/Rooms/hooks/useAddRoom"
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@nextui-org/spinner";
import Map from '@/components/Rooms/add-rooms/map';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { FaDollarSign, FaUserGroup, FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineSubtitles, MdGroupAdd, MdTitle, MdOutlinePets } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import ImageUploader from "./image-uploader";
import { reglas, servicios } from "@/components/Rooms/types/rules-services";

const AddRoomForm = () => {
  const [titulo, setTitulo] = useState("");
  const [price, setPrice] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [allowPets, setAllowPets] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number | undefined, lng: number | undefined, address: string | undefined }>({
    lat: undefined,
    lng: undefined,
    address: undefined
  });
  const [selectedServices, setSelectedServices] = useState<number[]>([]); 
  const [selectedRules, setSelectedRules] = useState<number[]>([]); 
  const { addRoom, isLoading } = useAddRoom();
  const toast = useToast();

  const [images, setImages] = useState<File[]>([]);

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, sube al menos una imagen.",
        status: "error",
        duration: 9000,
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
      minTime: parseInt(minTime, 10),
      maxTime: parseInt(maxTime, 10),
      maxPeople: parseInt(maxPeople, 10),
      sharedStatus,
      allowPets,
    };

    console.log(roomData);  
    console.log(images);  
  
    const roomId = await addRoom(roomData); 
  
    if (roomId) {
      await uploadImages(roomId, images);
    }
  };

  const handleServiceClick = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((service) => service !== id) : [...prev, id]
    );
  };

  const handleRuleClick = (id: number) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((rules) => rules !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Breadcrumb pageName="Publicar habitación"/>
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
            <h3 className="font-semibold text-dark dark:text-white">
              Ingresa la información de la habitación
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2 mx-auto">
                <label
                  className={`rounded-[10px] border-2 relative flex items-center justify-between cursor-pointer p-4 transition-all duration-200 
      ${sharedStatus ? 'bg-gray-300 border-primary' : 'bg-white border-stroke hover:bg-gray-300 hover:border-primary'}
      dark:bg-dark-2 dark:hover:bg-dark-3 dark:${sharedStatus ? 'bg-dark-3 border-primary' : ''}
    `}
                >
                  <input
                    type="checkbox"
                    checked={sharedStatus}
                    onChange={(e) => setSharedStatus(e.target.checked)}
                    className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center space-x-2">
                    <FaUserGroup className="text-primary" />
                    <span className="text-dark dark:text-white font-semibold">Cuarto compartido</span>
                  </div>
                  {sharedStatus && (
                    <span className="text-primary font-bold">✓</span>
                  )}
                </label>
              </div>


              <div className="w-full xl:w-1/2 mx-auto">
                <label
                  className={`rounded-[10px] border-2 relative flex items-center justify-between cursor-pointer p-4 transition-all duration-200
${allowPets ? 'bg-gray-300 border-primary' : 'bg-white border-stroke hover:bg-gray-300 hover:border-primary'}
      dark:bg-dark-2 dark:${allowPets ? 'bg-dark-3 border-primary' : 'hover:bg-dark-3'}
    `}
                >
                  <input
                    type="checkbox"
                    checked={allowPets}
                    onChange={(e) => setAllowPets(e.target.checked)}
                    className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center space-x-2">
                    <MdOutlinePets className="text-primary" />
                    <span className="text-dark dark:text-white font-semibold">Mascotas permitidas</span>
                  </div>
                  {allowPets && (
                    <span className="text-primary font-bold">✓</span>
                  )}
                </label>
              </div>



            </div>



            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-4/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <MdTitle className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el título de la publicación"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  required
                />
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <FaDollarSign className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Precio
                </label>
                <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                      required
                      min="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">MXN</span>
                  </div>
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <MdGroupAdd className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Habitantes max
                </label>
                <input
                  type="number"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  required
                />
              </div>
            </div>


            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <FaCheck   className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Tiempo de renta mínimo requerido
                </label>
                <div className="relative">
                    <input
                      type="number"
                      value={minTime}
                      onChange={(e) => setMinTime(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                      required
                      min="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">meses</span>
                  </div>
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <RxCross2 className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Tiempo de renta máximo requerido
                </label>
                <div className="relative">
                    <input
                      type="number"
                      value={maxTime}
                      onChange={(e) => setMaxTime(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                      required
                      min="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">meses</span>
                  </div>
              </div>
            
            </div>


            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2 ">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center">
                  <MdOutlineSubtitles className="mr-1 text-primary" />
                  Descripción
                </label>
                <textarea
                  placeholder="Ingrese la descripción de la publicación"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={8}
                  className="w-full h-[295px] rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none dark:active:border-primary"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center ">
                  <IoLocationSharp className="mr-1 text-primary" />
                  Ubicación de la habitación
                </label>
                <Map
                  onSelectLocation={(location: { coords: { lat: number; lng: number }; address: string }) => setLocation({ lat: location.coords.lat, lng: location.coords.lng, address: location.address })}
                />
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-full">
                {/* Servicios brindados */}
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Servicios brindados
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                  {servicios.map((servicio) => {
                    const isSelected = selectedServices.includes(servicio.id);
                    return (
                      <button
                        key={servicio.id}
                        type="button"
                        onClick={() => handleServiceClick(servicio.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center h-32 ${isSelected ? 'border-primary bg-gray-200 dark:border-primary dark:bg-dark' : 'border-gray-300 dark:bg-dark-2 dark:border-dark-3'}`}
                      >
                        <DotLottiePlayer src={servicio.animation} autoplay hover style={{ width: '40px', height: '40px' }} />
                        <span className="text-sm font-medium">{servicio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
 
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-full">
                {/* Reglas */}
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Reglas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {reglas.map((regla) => {
                    const isSelected = selectedRules.includes(regla.id);
                    return (
                      <button
                        key={regla.id}
                        type="button"
                        onClick={() => handleRuleClick(regla.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center h-32 ${isSelected ? 'border-primary bg-gray-200 dark:border-primary dark:bg-dark' : 'border-gray-300 dark:bg-dark-2 dark:border-dark-3'}`}
                      >
                        <DotLottiePlayer src={regla.animation} autoplay hover style={{ width: '40px', height: '40px' }} />
                        <span className="text-sm font-medium">{regla.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <ImageUploader onImagesChange={handleImagesChange} />

            <button
              type="submit"
              className="mt-5 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner color="success" />
                </>
              ) : (
                "Publicar habitación"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoomForm;
