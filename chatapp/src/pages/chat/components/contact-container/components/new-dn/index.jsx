
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { Input } from "@/components/ui/input";
  import { animationDefaultOptions, getColor } from "@/lib/utils";
  import Lottie from "react-lottie";
  import { apiClient } from "@/lib/api-client";
  import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { useAppStore } from "@/store";
  import { Avatar, AvatarImage } from "@/components/ui/avatar";
  
  function NewDM() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewConatctModal] = useState(false);
  
    const [searchedConatct, setsearchedConatct] = useState([]);
  
    const searchContacts = async (searchTerm) => {
      try {
        if (searchTerm.length > 0) {
          const response = await apiClient.post(
            SEARCH_CONTACTS_ROUTES,
            { searchTerm },
            { withCredentials: true }
          );
          if (response.status === 200 && response.data.contacts) {
            setsearchedConatct(response.data.contacts);
          }
        } else {
          setsearchedConatct([]);
        }
      } catch (error) {
        console.log({ error });
      }
    };
  
    const selectNewContact = (contact) => {
      setOpenNewConatctModal(false);
      setSelectedChatType("contact");
      setSelectedChatData(contact);
      setsearchedConatct([]);
    };
  
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => setOpenNewConatctModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
              Select New Contact
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <Dialog open={openNewContactModal} onOpenChange={setOpenNewConatctModal}>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
              <DialogTitle> Please select a contact</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <Input
                placeholder="Search contact"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => searchContacts(e.target.value)}
              />
            </div>
            {searchedConatct.length > 0 && (
              <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5">
                  {searchedConatct.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex gap-3 ite cursor-pointer"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="profile"
                              className="object-cover w-full h-full bg-black "
                            />
                          ) : (
                            <div
                              className={`uppercase w-12 h-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.split("").shift()
                                : contact.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {searchedConatct.length <= 0 && (
              <div className="flex-1  md:flex mt-5 md:mt-0  flex-col justify-center items-center  duration-1000 transition-all">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />
                <div
                  className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl 
              text-xl transition-all duration-300 text-center"
                >
                  <h2 className="poppins-medium">
                    Hi<span className="text-green-500"> ! </span>Search new
                    <span className="text-green-500"> Conatct</span>
                  </h2>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  export default NewDM;
  