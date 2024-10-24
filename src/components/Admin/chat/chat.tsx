"use client";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useGetApprovedChats from "@/components/Admin/hooks/useGetChats"; // Hook de chats
import Loader from "@/components/common/Loader";
import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Asegúrate de tener socket.io-client instalado

const Chat: React.FC = () => {
  const { chats, loading, error } = useGetApprovedChats(); // Obtener chats aprobados
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Estado para el chat seleccionado
  const [messages, setMessages] = useState<any[]>([]); // Estado para los mensajes
  const [loadingMessages, setLoadingMessages] = useState(false); // Estado de carga de mensajes
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // Estado de error en mensajes
  const [newMessage, setNewMessage] = useState<string>(""); // Estado para el nuevo mensaje

  // Conexión al socket
  const socket = io("https://uniroom-backend-services.onrender.com"); // Asegúrate de usar la URL correcta

  useEffect(() => {
    if (selectedChatId) {
      socket.emit("joinChat", selectedChatId); // Unirse al chat seleccionado

      // Obtener mensajes al unirse al chat
      fetchMessages(selectedChatId);
    }

    // Escuchar mensajes entrantes desde el servidor
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Agregar mensaje recibido
    });

    return () => {
      socket.off("message"); // Limpiar el listener al desmontar el componente
    };
  }, [selectedChatId]);

  // Función para obtener los mensajes del chat seleccionado
  const fetchMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`https://uniroom-backend-services.onrender.com/messages/${chatId}`);
      if (!response.ok) throw new Error("Error al obtener los mensajes.");

      const data = await response.json();
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
      nickname: "Gigdem", // Cambia esto según la lógica de tu aplicación
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTJhbGd3aTAwMDAwYmZyaHo0OWl1dm50IiwiaWF0IjoxNzI5NzU5NzQxfQ.-8jBfW6mPnZ9nruFCuWqfW7Pw7RNoPYUceFtWUMqtnc", // Cambia esto para obtener el token real
    };

    try {
      // Emitir el mensaje a través del socket
      socket.emit("message", messageData);

      // Guardar el mensaje en la base de datos
      await fetch("https://uniroom-backend-services.onrender.com/save-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: messageData.token,
          chatId: messageData.chatId,
          content: messageData.content,
        }),
      });

      // Limpiar el campo de entrada después de enviar
      setNewMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
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
      <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
          <div className="hidden h-full flex-col xl:flex xl:w-1/4">
            <div className="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
              <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                Chats activos
                <span className="rounded-md border-[.5px] ml-4 border-stroke bg-gray-2 px-2 py-0.5 text-base font-medium text-black dark:border-strokedark dark:bg-boxdark-2 dark:text-white 2xl:ml-4">
                  {chats.length}
                </span>
              </h3>
            </div>
            <div className="flex max-h-full flex-col overflow-auto p-5">
              <div className="no-scrollbar max-h-full space-y-2.5 overflow-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-gray-2 dark:hover:bg-strokedark"
                    onClick={() => handleChatSelect(chat.id)} // Llamar al manejar de selección
                  >
                    <div className="relative mr-3.5 h-11 w-full max-w-11 rounded-full">
                      <Image
                        src={chat.participantDetails[1]?.imageUrl || "/images/default-avatar.png"}
                        alt="profile"
                        className="h-full w-full object-cover object-center rounded-full"
                        width={44}
                        height={44}
                      />
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success"></span>
                    </div>
                    <div className="w-full">
                      <h5 className="text-sm font-medium text-black dark:text-white">
                        {chat.participantDetails[1]?.name}
                      </h5>
                      <p className="text-sm">Chat aprobado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
            {loadingMessages ? (
              <Loader /> // Mostrar loader mientras se obtienen los mensajes
            ) : errorMessages ? (
              <div className="text-center text-red-500">Error: {errorMessages}</div> // Mostrar error si hubo un problema
            ) : (
              <div className="p-6">
                {messages.length > 0 ? (
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index} className="mb-4">
                        <p>{message.content}</p>
                        <small>{new Date().toLocaleString()}</small> {/* Actualiza según el mensaje real */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center">No hay mensajes en este chat.</p>
                )}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="p-6">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full border rounded p-2"
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white rounded p-2">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
