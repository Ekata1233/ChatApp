import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  DELETE_CHAT_ROUTE,
  GET_USER_DETAILS_ROUTE,
  HOST,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ChatHeader() {
  const {
    closeChat,
    selectedChatData,
    setSelectedChatMessages,
    selectedChatType,
    selectedChatMessages,
  } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [adminUsername, setAdminUsername] = useState("");
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!selectedChatData || !selectedChatData._id) return;

        const newUsernames = { ...usernames };
        const newUserImages = { ...userImages };

        if (selectedChatType === "channel") {
          // Fetch admin username and image for channels
          if (selectedChatData.admin && !adminUsername) {
            const adminResponse = await apiClient.get(
              GET_USER_DETAILS_ROUTE.replace(":userId", selectedChatData.admin),
              { withCredentials: true }
            );
            setAdminUsername(adminResponse.data.userDetails.username);
            newUserImages[selectedChatData.admin] =
              adminResponse.data.userDetails.image;
          }

          // Fetch members' usernames and images
          for (const memberId of selectedChatData.members) {
            if (!newUsernames[memberId]) {
              const response = await apiClient.get(
                GET_USER_DETAILS_ROUTE.replace(":userId", memberId),
                { withCredentials: true }
              );
              console.log(response);

              newUsernames[memberId] = response.data.userDetails.username;
              newUserImages[memberId] = response.data.userDetails.image;
            }
          }
        } else if (selectedChatType === "contact") {
          // Fetch user details for contacts
          const contactResponse = await apiClient.get(
            GET_USER_DETAILS_ROUTE.replace(
              ":userId",
              selectedChatData._id || selectedChatData.id
            ),
            { withCredentials: true }
          );
          setUserDetails(contactResponse.data.userDetails);
        }

        setUsernames(newUsernames);
        setUserImages(newUserImages);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [selectedChatData, selectedChatType]);

  const handleDeleteChat = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this chat for yourself?")) {
        const previousMessages = [...selectedChatMessages];
        setSelectedChatMessages([]);
  
        const response = await apiClient.post(
          `${DELETE_CHAT_ROUTE}/self`, // Assuming this is the route for deleting the chat only for the current user
          { chatId: selectedChatData._id },
          { withCredentials: true }
        );
  
        if (!response.data.success) {
          alert(response.data.message || "Failed to delete the chat for yourself.");
          setSelectedChatMessages(previousMessages);
        }
      }
    } catch (error) {
      console.error("Error deleting chat for yourself:", error);
    }
  };
  

  const handleModalOpen = () => {
   
    setModalOpen(true);
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-5 ml-7 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div onClick={handleModalOpen} className="cursor-pointer">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact"
              ? selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email
              : null}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mr-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleDeleteChat}
          >
            <FaTrash className="text-xl cursor-pointer" />
          </button>

          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#181920] border-none text-white w-[350px] h-[250px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedChatType === "channel"
                ? selectedChatData.name
                : `${userDetails?.firstName || ""} ${
                    userDetails?.lastName || ""
                  }`}
            </DialogTitle>
            <DialogDescription>
              {selectedChatType === "channel" && (
                <>
                  <h4>
                    Admin:{" "}
                    <span className="text-gray-400">
                      {adminUsername || "Loading..."}
                    </span>
                  </h4>
                  <h4 className="mb-2 text-white">Members:</h4>
                  <ul className="list-disc text-sm text-gray-400 pl-5">
                    {(selectedChatData.members || []).map((member) => (
                      <li key={member} className="mb-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                          {userImages[member] ? (
                            <AvatarImage
                              src={`${HOST}/${userImages[member]}`}
                              alt="profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase w-6 h-6 text-xs border-[1px] flex items-center justify-center rounded-full ${getColor(
                                selectedChatData.color
                              )}`}
                            >
                              {usernames[member]?.charAt(0) || "?"}
                            </div>
                          )}
                        </Avatar>
                        {usernames[member] || "Loading..."}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selectedChatType === "contact" && (
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-white text-xl font-semibold">Contact Details</h3>
                  <Avatar className="h-16 w-16 rounded-full overflow-hidden">
                    {selectedChatData.image ? (
                      <AvatarImage
                        src={`${HOST}/${selectedChatData.image}`}
                        alt="profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div
                        className={`uppercase w-16 h-16 text-lg border-[1px] flex items-center justify-center rounded-full bg-gray-500 ${getColor(
                          selectedChatData.color
                        )}`}
                      >
                        {selectedChatData.firstName?.charAt(0) || "?"}
                      </div>
                    )}
                  </Avatar>

                  <div className="text-center">
                    <h6 className="text-white text-l font-semibold">
                      {selectedChatData.firstName} {selectedChatData.lastName}
                    </h6>
                    <p className="text-gray-400 text-sm">
                      {selectedChatData.email}
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatHeader;
