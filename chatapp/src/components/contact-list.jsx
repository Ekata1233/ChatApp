import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'

const ContactList = ({contacts,isChannel =false}) => {
    
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        selectedChatType,
        setSelectedChatMessages,
        setDirectMessagesContact, 
        directMessagesContact,
      } = useAppStore();
    
      const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
    
        if (selectedChatData && selectedChatData._id !== contact._id) {
          setSelectedChatMessages([]);
        }
        if (!isChannel && contact.messageCount > 0) {
          const updatedContacts = [...directMessagesContact]; 
          const contactIndex = updatedContacts.findIndex((c) => c._id === contact._id);
          if (contactIndex !== -1) {
            updatedContacts[contactIndex].messageCount = 0; 
            setDirectMessagesContact(updatedContacts);      
          }
        }
      };
  return (
  <div className="mt-5">
    {contacts.map((contact) => {
      // console.log(contact); 
      return (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer  ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#10b981] hover:bg-[#10b981]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border border-white/70"
                        : getColor(contact.color)
                    } uppercase w-10 h-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName
                  ? ` ${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}
            {!isChannel && contact.messageCount > 0 && (
              <div className="text-sm bg-[#10b981] text-white px-2 py-1 rounded-full">
                <span >+</span>{contact.messageCount} 
              </div>
            )}
          </div>
          
        </div>
      );
    })}
  </div>
);

};

export default ContactList