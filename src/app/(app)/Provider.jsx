'use client'

import ModalProvider from "@/context/ModalContext"
import UserProvider from "@/context/UserContext"

export default function Provider({children}) {
    return (
    <UserProvider>
        <ModalProvider>
            {children}
        </ModalProvider>
    </UserProvider>
    )
}