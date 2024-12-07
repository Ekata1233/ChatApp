import { useEffect } from "react";
import NewDM from "./components/new-dn";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

function ContactContainer() {

  const { setDirectMessagesContact, directMessagesContact, channels, setChannels } = useAppStore()

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true
      });
      if (response.data.contacts) {
        setDirectMessagesContact(response.data.contacts);
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTES, {
        withCredentials: true
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContact])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full ">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channel" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer;


const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-circle-6"
        width="80"
        height="40"
        viewBox="0 0 80 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="15"
          className="circle1"
          fill="#34d399"
        ></circle>
        <circle
          cx="40"
          cy="20"
          r="15"
          className="circle2"
          fill="#10b981"
        ></circle>
        <circle
          cx="60"
          cy="20"
          r="15"
          className="circle3"
          fill="#047857"
        ></circle>
      </svg>
      <span className="text-3xl font-semibold">VibeChat</span>

      <style>
        {`
          .circle1, .circle2, .circle3 {
            animation: colorChange 3s infinite ease-in-out;
          }

          .circle1 {
            animation-delay: 0s;
          }

          .circle2 {
            animation-delay: 0.5s;
          }

          .circle3 {
            animation-delay: 1s;
          }

          @keyframes colorChange {
            0% {
              fill: #34d399;
            }
            25% {
              fill: #10b981;
            }
            50% {
              fill: #047857;
            }
            75% {
              fill: #2d6a4f;
            }
            100% {
              fill: #34d399;
            }
          }
        `}
      </style>
    </div>
  );
}

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
  )
}
