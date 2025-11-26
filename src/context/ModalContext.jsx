'use client'

import { createContext, useContext, useState } from "react"
import ChatModal from "@/components/modal/ChatModal"

export const ModalContext = createContext(null)

export default function ModalProvider({children}){
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState([])

    const openModal = (() => {setIsOpen(true)})
    const closeModal = (() => {setIsOpen(false)})

    /**
     * recupère le json et charge les messages
     */
    function setNewMessage(){

    }

    const value = { isOpen, closeModal, openModal}

    return (
        <ModalContext.Provider value={value}>
            {children}

            <ChatModal 
            isOpen={isOpen}
            onClose={closeModal}
            />

        </ModalContext.Provider>
    )

}


export function useModal(){
    const ctx = useContext(ModalContext)
    if (!ctx) {
    throw new Error("useModal doit être utilisé dans <ModalProvider>")
  }
  return ctx
}