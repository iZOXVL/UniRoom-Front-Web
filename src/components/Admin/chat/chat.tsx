// Chat.tsx
"use client";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useGetChats from "@/components/Admin/hooks/useGetChats";
import useGetAllRoomsChat from "@/components/Admin/hooks/useGetAllRoomsChat";
import Loader from "@/components/common/Loader";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  BiSend,
  BiUser,
  BiCalendar,
  BiDollarCircle,
} from "react-icons/bi";
import { IoAttach, IoArrowBack } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { CiMenuKebab } from "react-icons/ci";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Íconos para las acciones
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  DateRangePicker,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const Chat: React.FC = () => {
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [roomIdsToFilter, setRoomIdsToFilter] = useState<string[]>([]);

  const { rooms, loading: roomsLoading, error: roomsError } = useGetAllRoomsChat();
  const { chats, loading, error, userToken, userName, userId } = useGetChats(
    roomIdsToFilter
  );

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // Estado para el modal de confirmar trato
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onOpenChange: onConfirmModalOpenChange,
  } = useDisclosure();

  // Estado para el modal de cancelar trato
  const {
    isOpen: isCancelModalOpen,
    onOpen: onCancelModalOpen,
    onOpenChange: onCancelModalOpenChange,
  } = useDisclosure();

  // Estados para los inputs del modal
  const [habitants, setHabitants] = useState<number>(1);
  const [monthlyPrice, setMonthlyPrice] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);

  const socket = useRef(io("https://uniroom-backend-services.onrender.com")).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setIsPickerVisible(false);
  };

  // Reset selectedChatId if it's not in the filtered chats
  useEffect(() => {
    if (selectedChatId && !chats.find((chat) => chat.id === selectedChatId)) {
      setSelectedChatId(null);
      setMessages([]);
    }
  }, [chats, selectedChatId]);

  // Fetch messages and handle socket events
  useEffect(() => {
    if (selectedChatId) {
      socket.emit("joinChat", selectedChatId);
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message.nickname !== userName) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [socket, userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `https://uniroom-backend-services.onrender.com/messages/${chatId}`
      );
      if (!response.ok) throw new Error("Error al obtener los mensajes.");
      const data = await response.json();
      setMessages(data.messages);
      setErrorMessages(null);
    } catch (error: any) {
      setErrorMessages(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage || !selectedChatId) return;

    const messageData = {
      chatId: selectedChatId,
      content: newMessage,
      nickname: userName,
      token: userToken,
    };

    socket.emit("message", messageData);

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData, isOwnMessage: true },
    ]);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoomChange = (roomIds: Set<string>) => {
    setSelectedRoomIds(roomIds);
  };

  const handleApplyFilter = () => {
    setRoomIdsToFilter(Array.from(selectedRoomIds));
  };

  // Manejo del formato de moneda MXN
  const handlePriceChange = (value: string) => {
    // Remover cualquier caracter que no sea dígito
    const numericValue = value.replace(/\D/g, "");
    // Formatear como moneda MXN
    const formattedValue = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(numericValue) / 100);
    setMonthlyPrice(formattedValue);
  };

  if (loading || roomsLoading) {
    return <Loader />;
  }

  if (error || roomsError) {
    return (
      <div className="text-center text-red-500">
        Error: {(error || roomsError)?.message}
      </div>
    );
  }

  // Obtener información del chat seleccionado
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <>
      <Breadcrumb pageName="Conversaciones" />
      <div className="h-[calc(97vh-186px)] sm:h-[calc(97vh-174px)]">
        <div className="h-full rounded-2xl border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark xl:flex overflow-hidden">
          <div
            className={`h-full flex-col xl:flex xl:w-1/4 ${
              selectedChatId ? "hidden xl:flex" : "flex"
            }`}
          >
            {/* Chat List Header */}
            <div className="sticky border-b border-stroke px-4 sm:px-6 py-7 sm:py-7 dark:border-dark-3 dark:bg-gray-dark">
              <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                Chats activos
                <span className="rounded-md border-[.5px] ml-4 border-stroke bg-gray-2 px-2 py-0.5 text-base font-medium text-black dark:border-dark-3 dark:bg-gray-dark dark:text-white">
                  {chats.length}
                </span>
              </h3>
            </div>
            <div className="flex max-h-full flex-col overflow-auto p-4 sm:p-5">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
                {/* Room Filter */}
                <Select
                  label="Filtrar por habitación"
                  placeholder="Selecciona una habitación"
                  selectionMode="multiple"
                  className="w-full sm:w-3/4"
                  size="sm"
                  selectedKeys={selectedRoomIds}
                  onSelectionChange={(keys) =>
                    handleRoomChange(new Set(keys as unknown as string[]))
                  }
                >
                  {rooms.map((room) => (
                    <SelectItem key={room.roomId} value={room.roomId}>
                      {room.title}
                    </SelectItem>
                  ))}
                </Select>

                {/* Apply Filter Button */}
                <Button
                  onClick={handleApplyFilter}
                  className="w-full sm:w-auto h-12"
                  size="sm"
                  color="primary"
                >
                  Aplicar
                </Button>
              </div>
              {/* Chat List */}
              <div className="no-scrollbar max-h-full space-y-2.5 overflow-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex cursor-pointer items-center rounded px-4 py-4 hover:bg-gray-2 dark:hover:bg-dark ${
                      selectedChatId === chat.id ? "bg-gray-2 dark:bg-dark" : ""
                    }`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="relative mr-3.5 h-11 w-full max-w-11 rounded-full">
                      <Image
                        src={
                          chat.participantDetails[1]?.imageUrl ||
                          "/images/default-avatar.png"
                        }
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

          {/* Chat Box */}
          <div
            className={`flex h-full flex-col border-l border-stroke dark:border-dark-3 dark:bg-gray-dark xl:w-3/4 ${
              selectedChatId ? "flex" : "hidden xl:flex"
            }`}
          >
            {selectedChatId && selectedChat && (
              <>
                {/* Chat Header */}
                <div className="sticky flex items-center justify-between border-b border-stroke px-4 sm:px-4 py-4 sm:py-4 dark:border-dark-3 dark:bg-gray-dark">
                  <div className="flex items-center">
                    {/* Back button on small screens */}
                    <button
                      className="mr-2 xl:hidden"
                      onClick={() => setSelectedChatId(null)}
                    >
                      <IoArrowBack size={24} />
                    </button>

                    <div className="mr-4.5 h-13 w-full max-w-13 rounded-full">
                      <Image
                        src={
                          selectedChat.participantDetails[1]?.imageUrl ||
                          "/images/default-avatar.png"
                        }
                        alt="avatar"
                        className="h-full w-full object-cover object-center rounded-full"
                        width={52}
                        height={52}
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {selectedChat.participantDetails[1]?.name}
                      </h5>
                      <p>{selectedChat.roomDetails.title}</p>
                    </div>
                  </div>
                  {/* Botones Confirmar y Cancelar Trato */}
                  <div className="flex items-center space-x-2">
                    {/* Mostrar botones en pantallas medianas y grandes */}
                    <div className="hidden sm:flex space-x-2">
                      <Button
                        color="success"
                        size="sm"
                        onClick={onConfirmModalOpen}
                        variant="flat"
                        startContent={<FaCheckCircle />}
                      >
                        Confirmar trato
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        variant="flat"
                        onClick={onCancelModalOpen}
                        startContent={<FaTimesCircle />}
                      >
                        Cancelar trato
                      </Button>
                    </div>
                    {/* Mostrar menú en dispositivos móviles */}
                    <div className="flex sm:hidden">
                      <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" aria-label="Más opciones">
                            <CiMenuKebab size={24} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Acciones">
                          <DropdownItem
                            key="confirm"
                            color="success"
                            description="Confirmar trato"
                            startContent={<FaCheckCircle color="green" />}
                            onClick={onConfirmModalOpen}
                          >
                            Confirmar trato
                          </DropdownItem>
                          <DropdownItem
                            key="cancel"
                            color="danger"
                            description="Cancelar trato"
                            startContent={<FaTimesCircle color="red" />}
                            onClick={onCancelModalOpen}
                          >
                            Cancelar trato
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>

                {/* Modal Confirmar Trato */}
                <Modal
                  isOpen={isConfirmModalOpen}
                  onOpenChange={onConfirmModalOpenChange}
                  placement="auto"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Confirmar Trato
                        </ModalHeader>
                        <ModalBody>
                          <p>
                            ¿Estás seguro de que deseas confirmar el trato para la
                            habitación{" "}
                            <strong className="text-primary">
                              {selectedChat.roomDetails.title}
                            </strong>{" "}
                            con{" "}
                            <strong className="text-primary">
                              {selectedChat.participantDetails[1]?.name}
                            </strong>
                            ?
                          </p>
                          <div className="mt-4 space-y-4">
                            <Input
                              label="Número de habitantes"
                              type="number"
                              min="1"
                              value={habitants.toString()}
                              onChange={(e) => setHabitants(Number(e.target.value))}
                              placeholder="Ingrese el número de habitantes"
                              startContent={<BiUser />}
                            />
                            <Input
                              label="Precio mensual"
                              value={monthlyPrice}
                              onChange={(e) => handlePriceChange(e.target.value)}
                              placeholder="Ingrese el precio mensual"
                              startContent={<BiDollarCircle />}
                            />
                            <DateRangePicker
                              label="Fechas de estancia"
                              value={dateRange}
                              onChange={(value) => setDateRange(value)}
                              startContent={<BiCalendar />}
                              className="w-full cursor-pointer"
                              visibleMonths={1}
                            />
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" variant="flat" onPress={onClose}>
                            Cancelar
                          </Button>
                          <Button
                            color="success"
                            onPress={() => {
                              // Lógica para enviar datos a la API
                              // Aquí puedes extraer las fechas de inicio y fin del dateRange
                              // y construir el objeto para enviar a la API
                              onClose();
                            }}
                          >
                            Confirmar
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

                {/* Modal Cancelar Trato */}
                <Modal
                  isOpen={isCancelModalOpen}
                  onOpenChange={onCancelModalOpenChange}
                  placement="auto"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Cancelar Trato
                        </ModalHeader>
                        <ModalBody>
                          <p>
                            ¿Estás seguro de que deseas cancelar el trato con{" "}
                            <strong className="text-primary">
                              {selectedChat.participantDetails[1]?.name}
                            </strong>{" "}
                            para la habitación{" "}
                            <strong className="text-primary">
                              {selectedChat.roomDetails.title}
                            </strong>
                            ?
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="default" variant="flat" onPress={onClose}>
                            No
                          </Button>
                          <Button
                            color="danger"
                            onPress={() => {
                              // Lógica para cancelar trato
                              onClose();
                            }}
                          >
                            Sí, cancelar
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

                {/* Messages */}
                {loadingMessages ? (
                  <Loader />
                ) : errorMessages ? (
                  <div className="text-center text-red-500">
                    Error: {errorMessages}
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 flex-grow overflow-auto">
                    {messages.length > 0 ? (
                      <ul className="space-y-4">
                        {messages.map((message, index) => (
                          <li
                            key={index}
                            className={`flex flex-col ${
                              message.nickname === userName
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`inline-block mb-1.5 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 max-w-[80%] ${
                                message.nickname === userName
                                  ? "bg-primary text-white rounded-br-none"
                                  : "bg-gray-200 dark:bg-strokedark rounded-tl-none"
                              } break-words`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <p
                              className={`text-xs text-gray-500 ${
                                message.nickname === userName
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {message.nickname === userName
                                ? "Tú"
                                : message.nickname}
                            </p>
                          </li>
                        ))}
                        {/* This div is used to scroll to the bottom */}
                        <div ref={messagesEndRef}></div>
                      </ul>
                    ) : (
                      <div className="flex items-center justify-center bg-transparent dark:bg-transparent flex-col">
                        <DotLottiePlayer
                          src="/lotties/chat.lottie"
                          autoplay
                          speed={0.55}
                          style={{
                            width: "50vw",
                            maxWidth: "500px",
                            height: "auto",
                            maxHeight: "250px",
                          }}
                        ></DotLottiePlayer>
                      </div>
                    )}
                  </div>
                )}

                {/* Chat Input */}
                <div className="border-t border-stroke p-4 sm:p-5 dark:border-dark-3 dark:bg-gray-dark">
                  <form className="relative" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="w-full rounded-full border-[1.5px] bg-slate-50 border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:active:border-primary"
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      type="submit"
                    >
                      <BiSend size={20} />
                    </button>
                    <button
                      className="absolute right-12 top-1/2 -translate-y-1/2"
                      type="button"
                    >
                      <IoAttach size={20} />
                    </button>
                    <button
                      className="absolute right-20 top-1/2 -translate-y-1/2"
                      type="button"
                      onClick={() => setIsPickerVisible(!isPickerVisible)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
