"use client";

import React, { use } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import useAddRoom from "@/hooks/rooms/useAddRoom";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@nextui-org/spinner";
import Map from '@/components/Map/map';
import animations from '@/icons/animations.js';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { FaDollarSign, FaUserGroup, FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineSubtitles, MdGroupAdd, MdTitle, MdOutlinePets } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

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
  const [location, setLocation] = useState<{ lat: number | undefined, lng: number | undefined }>({ lat: undefined, lng: undefined });
  const [selectedServices, setSelectedServices] = useState<string[]>([]); // Para manejar los servicios seleccionados
  const { addRoom, isLoading } = useAddRoom();
  const toast = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) {
      toast({
        title: "Error",
        description: "Por favor, sube una imagen.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!location.lat || !location.lng) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una ubicación en el mapa.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1];
      addRoom({ titulo, descripcion, price, minTime,maxTime, sharedStatus: sharedStatus ? 'true' : 'false', allowPets: allowPets ? 'true' : 'false', maxPeople, imagenBase64: base64String, lat: location.lat, lng: location.lng, services: selectedServices });
    };
    reader.readAsDataURL(imagen);

    if (!isLoading) {
      setTitulo("");
      setDescripcion("");
      setImagen(null);
    }
  };

  const servicios = [
    { id: 'wifi', label: 'WiFi incluido', animation: animations.wifi },
    { id: 'agua', label: 'Agua', animation: animations.agua },
    { id: 'gas', label: 'Gas', animation: animations.gas },
    { id: 'calentador', label: 'Calentador solar', animation: animations.solar },
    { id: 'aire', label: 'Aire acondicionado', animation: animations.aire },
    { id: 'boiler', label: 'Boiler', animation: animations.boiler },
    { id: 'sala', label: 'Sala de estar compartida', animation: animations.sala },
    { id: 'jardin', label: 'Jardin compartido', animation: animations.jardin },
    { id: 'comedor', label: 'Comedor compartido', animation: animations.comedor },
    { id: 'cocina', label: 'Cocina compartida', animation: animations.cocina },
    { id: 'camara', label: 'Camaras de seguridad', animation: animations.camara },
    { id: 'acceso', label: 'Acceso controlado', animation: animations.acceso },
    { id: 'portero', label: 'Portero', animation: animations.portero },
    { id: 'baño', label: 'Baño privado', animation: animations.baño },
    { id: 'bañoc', label: 'Baño compartido', animation: animations.bañoc },
    { id: 'estacionamiento', label: 'Estacionamiento', animation: animations.parking },
    { id: 'lavadora', label: 'Acceso a lavadora', animation: animations.lavadora },
    { id: 'escritorio', label: 'Escritorio', animation: animations.desk },
    { id: 'armario', label: 'Armario', animation: animations.closet },
  ];



  const reglas = [
    { id: 'fiestas', label: 'No se permiten fiestas', animation: animations.fiestas },
    { id: 'silencio', label: 'Silencio después de las 10pm', animation: animations.silencio },
    { id: 'visitas', label: 'No se permiten visitas nocturnas', animation: animations.visitas },
    { id: 'smoke', label: 'No fumar dentro de la propiedad', animation: animations.smoke },
    { id: 'limpieza', label: 'Mantener la limpieza en áreas comunes', animation: animations.clean },
    { id: 'respect', label: 'Respetar las pertenencias ajenas', animation: animations.respect },
    { id: 'pets', label: 'No se permiten mascotas sin autorización', animation: animations.pet },
    { id: 'horario', label: 'Respetar el horario de llegada establecido', animation: animations.horario },
    { id: 'broke', label: 'Informar al propietario sobre cualquier daño en la propiedad', animation: animations.broke },
    { id: 'move', label: 'Prohibido mover muebles sin autorización', animation: animations.furniture },
    { id: 'exit', label: 'No bloquear salidas de emergencia', animation: animations.exit },
    { id: 'dishes', label: 'Lavar los utensilios de cocina después de usarlos', animation: animations.dishes },
    { id: 'alter', label: 'Prohibido alterar el WiFi o la electricidad', animation: animations.alter },
  ];

  const handleServiceClick = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((service) => service !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Breadcrumb pageName="Publicar habitación" />
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
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  required
                />
              </div>

              <div className="w-full xl:w-1/6">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <MdGroupAdd className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Número max habitantes
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
                  Inicio de disponibilidad
                </label>
                <input
                  type="date"
                  value={minTime}
                  onChange={(e) => setMinTime(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  required
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 font-semibold text-body-m text-dark dark:text-white flex items-center">
                  <RxCross2 className="mr-1 text-primary" /> {/* Añadimos margen derecho para separar el ícono del texto */}
                  Fin de disponibilidad
                </label>
                <input
                  type="date"
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  required
                />
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
                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none dark:active:border-primary"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-3 text-body-m font-semibold text-dark dark:text-white flex items-center ">
                  <IoLocationSharp className="mr-1 text-primary" />
                  Ubicación de la habitación
                </label>
                {/* <Map
                  onSelectLocation={(coords: { lat: number; lng: number }) => setLocation(coords)}
                />  */}
                <div className="mt-2 text-sm text-dark dark:text-white">
                  Coordenadas seleccionadas: Latitud: {location.lat}, Longitud: {location.lng}
                </div>
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                {/* Servicios brindados */}
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Servicios brindados
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {servicios.map((servicio) => {
                    const isSelected = selectedServices.includes(servicio.id);
                    return (
                      <button
                        key={servicio.id}
                        type="button"
                        onClick={() => handleServiceClick(servicio.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center h-32 ${isSelected ? 'border-primary bg-gray-200 dark:border-primary dark:bg-dark' : 'border-gray-300 dark:bg-dark-2 dark:border-dark-3'}`}
                      >
                        <DotLottiePlayer src={servicio.animation} autoplay loop style={{ width: '40px', height: '40px' }} />
                        <span className="text-sm font-medium">{servicio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <div className="w-0.5 h-[80%] bg-[#2b5973] mx-5"></div>
              </div>

              <div className="w-full xl:w-1/2">
                {/* Reglas */}
                <label className="mb-3 block text-body-m font-semibold text-dark dark:text-white">
                  Reglas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {reglas.map((regla) => {
                    const isSelected = selectedServices.includes(regla.id);
                    return (
                      <button
                        key={regla.id}
                        type="button"
                        onClick={() => handleServiceClick(regla.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center h-32 ${isSelected ? 'border-primary bg-gray-200 dark:border-primary dark:bg-dark' : 'border-gray-300 dark:bg-dark-2 dark:border-dark-3'}`}
                      >
                        <DotLottiePlayer src={regla.animation} autoplay loop style={{ width: '40px', height: '40px' }} />
                        <span className="text-sm font-medium">{regla.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>


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
