'use client'

import { useEffect, useRef } from "react"

export default function ChatModal( {isOpen, onClose}) {

    const dialogRef = useRef(null)

    const close = () => {
        dialogRef.current?.close()
        onClose?.()
    }

    useEffect(() =>{
        const dialog = dialogRef.current;
        if (!dialog) return

        if (isOpen && !dialog.open){
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const handleCancel = (e) => {
        e.preventDefault()
        onClose?.()
        }

        dialog.addEventListener("cancel", handleCancel)
        return () => dialog.removeEventListener("cancel", handleCancel)
    }, [onClose])

    return (
    <dialog
    ref={dialogRef}
    onClose={onClose}
    className="w-[90%] xl:w-[1200px] h-[900px] m-auto bg-foreground relative backdrop:opacity-80 rounded-t-sm"
    closedby="any"
    >
    
    <button onClick={close} className="absolute top-5.5 right-8.25 flex items-center gap-2 typo-sm text-tertiary cursor-pointer">
        Fermer 
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.811565 12.0038C0.603399 12.0038 0.397109 11.925 0.237703 11.7656C-0.0792342 11.4487 -0.0792342 10.9348 0.237703 10.6179L10.6197 0.239595C10.9367 -0.0773421 11.4505 -0.0773421 11.7675 0.239595C12.0844 0.556532 12.0844 1.07038 11.7675 1.38732L1.38543 11.7656C1.2279 11.925 1.01973 12.0038 0.811565 12.0038Z" fill="#717171"/>
            <path d="M11.1937 12.0038C10.9855 12.0038 10.7792 11.925 10.6198 11.7656L0.239656 1.38544C-0.0772811 1.06851 -0.0772811 0.554655 0.239656 0.237718C0.556593 -0.079219 1.07044 -0.079219 1.38738 0.237718L11.7675 10.6179C12.0845 10.9348 12.0845 11.4487 11.7675 11.7656C11.6081 11.925 11.4 12.0038 11.1937 12.0038Z" fill="#717171"/>
        </svg>
    </button>

    <h1 className="typo-lg text-primary text-center mt-29.5">Posez vos questions sur votre programme, <br/>
        vos performances ou vos objectifs</h1>
    
    </dialog>
  )
}