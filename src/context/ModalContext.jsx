'use client'

import { createContext, useContext, useState } from "react"
import ChatModal from "@/components/modal/ChatModal"

export const ModalContext = createContext(null)

export default function ModalProvider({children}){
    const [isOpen, setIsOpen] = useState(false)


    const openModal = (() => {setIsOpen(true)})
    const closeModal = (() => {setIsOpen(false)})

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