'use client'

import { useEffect, useRef } from "react"

export default function ChatModal( {isOpen, handleClose}) {

    const dialogRef = useRef(null)

    const close = () => {
        dialogRef.current?.close()
        handleClose?.()
    }

    useEffect(() =>{
        const dialog = dialogRef.current;
        if (!dialog) return

        if (isOpen && !dialogRef.current?.open){
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    }, [isOpen])

    
  return (
    <dialog
    ref={dialogRef}
    onClose={handleClose}
    >

    <p>BLIBLABLOU</p>
    <button onClick={close}>XXX</button>
    </dialog>
  )
}