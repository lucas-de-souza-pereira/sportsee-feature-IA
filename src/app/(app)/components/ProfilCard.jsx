
import Image from "next/image"
import { formatLongDate } from "../../../../utils/formatters"

export default function ProfileCard({profilePicture, firstName, lastName, createdAt}) {

    const src = profilePicture ?? "/images/avatarDefault/avatar.png"

    return (
        <div className="flex flex-row gap-9.5">
            <h2 className="sr-only">Profil</h2> 
            <div className="relative w-[107px] h-[124px] overflow-hidden rounded-md group ">
                <Image 
                src={src} 
                alt="Photo de profil" 
                fill 
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-130 transform-gpu"
                />
            </div>
            
            <div className="content-center">
                <h3 className="typo-lg">{firstName} {lastName}</h3>
                <p className="typo-sm text-tertiary mt-1">Membre depuis le {formatLongDate(createdAt)}</p>
            </div>
        </div>
    )
}

