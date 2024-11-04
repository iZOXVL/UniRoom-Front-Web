"use client";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useGetApprovedChats from "@/components/Admin/hooks/useGetChats"; // Hook de chats
import Loader from "@/components/common/Loader";
import { useState, useEffect, useRef } from "react"; // Importar useRef
import { io } from "socket.io-client"; // Asegúrate de tener socket.io-client instalado
import { BiSearch, BiSend } from "react-icons/bi";
import { IoAttach } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const Chat: React.FC = () => {
  const { chats, loading, error, userToken, userName, userId } = useGetApprovedChats(); // Obtener chats aprobados
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Estado para el chat seleccionado
  const [messages, setMessages] = useState<any[]>([]); // Estado para los mensajes
  const [loadingMessages, setLoadingMessages] = useState(false); // Estado de carga de mensajes
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // Estado de error en mensajes
  const [newMessage, setNewMessage] = useState<string>(""); // Estado para el nuevo mensaje
  const [isPickerVisible, setIsPickerVisible] = useState(false); 


  // Conexión al socket
  const socket = io("https://uniroom-backend-services.onrender.com"); // Asegúrate de usar la URL correcta

  // Crear una referencia para el contenedor de mensajes
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Función para hacer scroll al final del contenedor de mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 // Actualiza la función para que solo reciba el parámetro de emoji
const onEmojiClick = (emojiObject: EmojiClickData) => {
  setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  setIsPickerVisible(false); // Cierra el picker después de seleccionar el emoji
};


  useEffect(() => {
    if (selectedChatId) {
      socket.emit("joinChat", selectedChatId); // Unirse al chat seleccionado
      fetchMessages(selectedChatId);
    }

    // Escuchar mensajes entrantes
    socket.on("message", (message) => {
      console.log("Nick", message);
      // Solo añadir al estado `messages` si el mensaje no es propio
      if (message.from !== userName) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("message"); // Limpiar el listener al desmontar el componente
    };
  }, [selectedChatId]);

  // Hacer scroll al final cada vez que los mensajes cambien
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para obtener los mensajes del chat seleccionado
  const fetchMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`https://uniroom-backend-services.onrender.com/messages/${chatId}`);
      if (!response.ok) throw new Error("Error al obtener los mensajes.");

      const data = await response.json();
      console.log("Data", data);
      console.log("Chats", chats);
      setMessages(data.messages); // Guardar los mensajes en el estado
      setErrorMessages(null);
    } catch (error: any) {
      setErrorMessages(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Manejar la selección de un chat
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    fetchMessages(chatId); // Llamar a la función para obtener los mensajes
  };

  // Función para enviar un mensaje
  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage || !selectedChatId) return;
  
    const messageData = {
      chatId: selectedChatId,
      content: newMessage,
      nickname: userName,
      token: userToken,
    };
  
    // Emitir el mensaje con el socket
    socket.emit("message", messageData);
  
    // Añadir el mensaje directamente al estado `messages` como mensaje propio
    setMessages((prevMessages) => [...prevMessages, { ...messageData, isOwnMessage: true }]);
    setNewMessage(""); // Limpiar el campo de entrada
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Conversaciones" />
      <div className="h-[calc(93vh-186px)] sm:h-[calc(93vh-174px)]">
        <div className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark xl:flex">
          <div className=" h-full flex-col xl:flex xl:w-1/4">
            {/* Chat List Header */}
            <div className="sticky border-b border-stroke px-6 py-7.5 dark:border-dark-3 dark:bg-gray-dark">
              <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                Chats activos
                <span className="rounded-md border-[.5px] ml-4 border-stroke bg-gray-2 px-2 py-0.5 text-base font-medium text-black dark:border-dark-3 dark:bg-gray-dark dark:text-white">
                  {chats.length}
                </span>
              </h3>
            </div>
            <div className="flex max-h-full flex-col overflow-auto p-5">
              <form className="relative mb-7">
                <input
                  type="text"
                  className="w-full rounded border border-stroke bg-gray-2 py-2.5 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-gray-dark"
                  placeholder="Buscar..."
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  <BiSearch />
                </button>
              </form>
              <div className="no-scrollbar max-h-full space-y-2.5 overflow-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-gray-2 dark:hover:bg-dark"
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="relative mr-3.5 h-11 w-full max-w-11 rounded-full">
                      <Image
                        src={chat.participantDetails[1]?.imageUrl || "/images/default-avatar.png"}
                        alt="profile"
                        className="h-full w-full object-cover object-center rounded-full"
                        width={44}
                        height={44}
                      />
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success "></span>
                    </div>
                    <div className="w-full">
                      <h5 className="text-sm font-medium text-black dark:text-white">
                        {chat.participantDetails[1]?.name}
                      </h5>
                      <p className="text-sm">{chat.roomDetails.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

                <br />
          {/* Chat Box */}
          <div className="flex h-full flex-col border-l  sm:shadow-none shadow-default border-stroke dark:border-dark-3 dark:bg-gray-dark xl:w-3/4">
            {selectedChatId && (
              <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-dark-3 dark:bg-gray-dark">
                <div className="flex items-center">
                  <div className="mr-4.5 h-13 w-full max-w-13 rounded-full">
                    <Image
                      src={chats.find(chat => chat.id === selectedChatId)?.participantDetails[1]?.imageUrl || "/images/default-avatar.png"}
                      alt="avatar"
                      className="h-full w-full object-cover object-center"
                      width={52}
                      height={52}
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {chats.find(chat => chat.id === selectedChatId)?.participantDetails[1]?.name}
                    </h5>
                    <p>
                      {chats.find(chat => chat.id === selectedChatId)?.roomDetails.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loadingMessages ? (
              <Loader />
            ) : errorMessages ? (
              <div className="text-center text-red-500">Error: {errorMessages}</div>
            ) : (
              <div className="p-6 flex-grow overflow-auto">
                {messages.length > 0 ? (
                  <ul className="space-y-4">
                    {messages.map((message, index) => (
                      <li
                        key={index}
                        className={`flex flex-col ${message.nickname === userName ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`inline-block mb-1.5 rounded-2xl px-5 py-4 ${message.nickname === userName
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-gray-200 dark:bg-strokedark rounded-tl-none'
                            }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 ${message.nickname === userName ? 'text-right' : 'text-left'}`}
                        >
                          {message.nickname === userName ? 'Tú' : message.nickname}
                        </p>
                      </li>
                    ))}
                    {/* Este div vacío sirve como ancla para el scroll */}
                    <div ref={messagesEndRef}></div>
                  </ul>
                ) : (
                  <div className="flex items-center justify-center bg-transparent dark:bg-transparent flex-col">
                    <DotLottiePlayer
                      src="/lotties/chat.lottie"
                      autoplay
                      speed={0.55}
                      style={{
                        width: '80vw', // Toma el 80% del ancho de la ventana 
                        maxWidth: '500px', // Máximo de 500px para pantallas más grandes
                        height: 'auto',    // Ajusta la altura automáticamente
                        maxHeight: '400px' // Máximo de 400px de altura

                      }}
                    >
                    </DotLottiePlayer>
                    <h1 className="text-3xl font-bold text-black dark:text-slate-200 text-center">
                      Conversa con tus futuros inquilinos
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 text-center">
                      Conéctate con estudiantes interesados, responde sus preguntas y facilita el proceso de renta de tus habitaciones.
                    </p>
                  </div>
                )}
              </div>

            )}

            {/* Chat Input */}
            {selectedChatId && (
              <div className="border-t border-stroke p-5 dark:border-dark-3 dark:bg-gray-dark">
                <form className="relative" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2" type="submit">
                    <BiSend size={20} />
                  </button>
                  <button className="absolute right-12 top-1/2 -translate-y-1/2" type="button">
                    <IoAttach size={20} />
                  </button>
                  <button
                    className="absolute right-20 top-1/2 -translate-y-1/2"
                    type="button"
                    onClick={() => setIsPickerVisible(!isPickerVisible)} // Alterna el picker
                  >
                    <SlEmotsmile size={20} />
                  </button>
                  {isPickerVisible && (
                    <div className="absolute bottom-full right-0 mb-2">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
