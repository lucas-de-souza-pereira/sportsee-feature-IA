'use client'

import { useEffect, useRef, useState } from "react"

import Proposal from "./components/Proposal"
import Message from "./components/Message"


export default function ChatModal( {isOpen, onClose}) {
    const [q, setQ] = useState("")
    const [message, setMessage] = useState([])
    console.log("message open",message)
    const dialogRef = useRef(null)

    const close = () => {
        dialogRef.current?.close()
        onClose?.()
    }

    const setNewMessage = (user, msg) => {
        const m = { user, text:msg }
        setMessage(prev => [...prev, m])} 

        const mestest = 'Votre score de récupération indique à quel point votre corps a récupéré après vos précédents entraînements. Il prend en compte plusieurs facteurs comme :💤 La qualité de votre sommeil ❤️ Votre fréquence cardiaque au repos 🧘‍♂️ Votre niveau de stress 🏋️‍♀️ L’intensité de vos séances récentes Un score élevé (80-100) signifie que vous êtes en bonne forme pour vous entraîner à nouveau.Un score moyen (50-79) suggère de privilégier une séance plus légère ou de récupération . Un score faible (<50) indique que votre corps a besoin de repos.📊 Ce score vous aide à éviter le surentraînement et à progresser en respectant vos capacités du moment.Souhaitez-vous des conseils pour améliorer votre récupération ?'

    async function sendMessage() {
        setNewMessage("user", q )
        console.log("message send message",message)
        setNewMessage("assistant", mestest)
        console.log("message assistant message",message)
        // try{
        //     const r = await fetch('/api/mistralAi/chatBot',{
        //         method: 'POST',
        //         headers: {'Content-Type':'application/json'},
        //         body: JSON.stringify({message: q})
        //     })

        //     if (!r.ok) {
        //         throw new Error(`Erreur lors du chargement des données : ${res.status}`)
        //     }

        //     const answer = await r.json()
        //     console.log(answer)
        // } catch(err){
        //     console.error('Erreur ChatModal :', err.message)
        // }
        setQ("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.altKey){
            e.preventDefault()
            sendMessage()
        }
    }

    // open/close
    useEffect(() =>{
        const dialog = dialogRef.current;
        if (!dialog) return

        if (isOpen && !dialog.open){
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    }, [isOpen])

    // block hidden
    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    // close with backdrop and escape
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

    {(message.length === 0) && (<h1 className="typo-lg text-primary text-center mt-29.5">
        Posez vos questions sur votre programme, <br/>
        vos performances ou vos objectifs
        </h1>)}
    
    {(message.length > 0) && (
        <div className="w-[800px] mt-19.75 flex flex-col gap-10 m-auto">
            {message.map((msg, index) => (
                <Message key={index} {...msg}/>
            ))}

        </div>
    )}


    <div className="absolute bottom-5.5 left-2/12 w-[800px]">

        <form className="relative" onSubmit={handleSubmit} >
            <textarea 
            className="w-full h-[139px] border border-[#E7E7E7] rounded-lg p-4 resize-none"
            value={q}
            onChange={(e) => { setQ(e.target.value)}}
            onKeyDown={handleKeyDown}
            />
            {!q && (
                <div className="absolute left-4 top-4 flex flex-row items-center gap-4">
                    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.97444 5.20041C7.18569 4.51182 8.16047 4.51182 8.37171 5.20042L9.36071 8.42423C9.43181 8.65601 9.61324 8.83744 9.84502 8.90854L13.0688 9.89754C13.7574 10.1088 13.7574 11.0836 13.0688 11.2948L9.84502 12.2838C9.61324 12.3549 9.43181 12.5363 9.36071 12.7681L8.37171 15.9919C8.16046 16.6805 7.18569 16.6805 6.97444 15.9919L5.98545 12.7681C5.91434 12.5363 5.73292 12.3549 5.50114 12.2838L2.27732 11.2948C1.58873 11.0836 1.58873 10.1088 2.27732 9.89754L5.50114 8.90854C5.73292 8.83744 5.91434 8.65601 5.98545 8.42423L6.97444 5.20041Z" fill="#FCC1B6"/>
    <path d="M12.8876 0.86755C12.9681 0.60523 13.3395 0.60523 13.4199 0.867551L13.7967 2.09567C13.8238 2.18397 13.8929 2.25308 13.9812 2.28017L15.2093 2.65693C15.4716 2.73741 15.4716 3.10875 15.2093 3.18922L13.9812 3.56598C13.8929 3.59307 13.8238 3.66219 13.7967 3.75048L13.4199 4.9786C13.3395 5.24092 12.9681 5.24092 12.8876 4.9786L12.5109 3.75048C12.4838 3.66219 12.4147 3.59307 12.3264 3.56598L11.0983 3.18922C10.8359 3.10875 10.8359 2.73741 11.0983 2.65693L12.3264 2.28017C12.4147 2.25308 12.4838 2.18397 12.5109 2.09567L12.8876 0.86755Z" fill="#FCC1B6"/>
    <path d="M14.6147 13.616C14.7254 13.2553 15.236 13.2553 15.3466 13.616L15.8647 15.3046C15.9019 15.4261 15.9969 15.5211 16.1183 15.5583L17.807 16.0764C18.1677 16.187 18.1677 16.6976 17.807 16.8083L16.1183 17.3263C15.9969 17.3636 15.9019 17.4586 15.8647 17.58L15.3466 19.2687C15.236 19.6294 14.7254 19.6294 14.6147 19.2687L14.0967 17.58C14.0594 17.4586 13.9644 17.3636 13.843 17.3263L12.1543 16.8083C11.7936 16.6976 11.7936 16.187 12.1543 16.0764L13.843 15.5583C13.9644 15.5211 14.0594 15.4261 14.0967 15.3046L14.6147 13.616Z" fill="#FCC1B6"/>
                    </svg>
                    <p className="typo-sm text-tertiary">Comment puis-je vous aider ?</p>
                </div>
            )}
            <button
            type="submit"
            className="absolute bottom-4 right-6.5 bg-primary p-4 rounded-sm cursor-pointer"
            >
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.862 5.80239C10.6649 5.99742 10.3449 5.99792 10.1479 5.80239L6.00993 1.70546V15.5C6.00993 15.776 5.7839 16 5.50486 16C5.22583 16 4.99979 15.776 4.99979 15.5V1.70546L0.861834 5.8019C0.66481 5.99742 0.344792 5.99742 0.147768 5.8019C-0.049256 5.60637 -0.049256 5.28984 0.147768 5.09481L5.14781 0.144774C5.34284 -0.0482597 5.66735 -0.0482597 5.86237 0.144774L10.8624 5.09481C11.0595 5.29034 11.0595 5.60687 10.862 5.80239C11.0595 5.60687 10.6649 5.99742 10.862 5.80239Z" fill="white"/>
                </svg>
            </button>
        </form>

        <div className="w-full flex flex-row gap-3.25 mt-6">
            <Proposal>Comment améliorer mon endurance ?</Proposal>
            <Proposal>Que signifie mon score de récupération ?</Proposal>
            <Proposal>Peux-tu m’expliquer mon dernier graphique ?</Proposal>
        </div>
    </div>


    </dialog>
    )
}