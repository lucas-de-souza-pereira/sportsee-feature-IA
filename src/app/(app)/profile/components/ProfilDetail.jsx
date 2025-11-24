
import { formatGender, formatHeight } from "../../../../../utils/formatters"

export default function ProfilDetail({age,gender,height,weight}) {

    return (
    <div className="card px-7 pt-10 pb-15" >
        <h2 className="typo-lg">Votre profil</h2>
        <hr className="border-tertiary mt-6" />
        <ul className="typo-base text-tertiary mt-8 flex flex-col gap-6">
            <li>Âge : {age? age : "Non renseigné"}</li>
            <li>Genre : {formatGender(gender)}</li>
            <li>Taille : {formatHeight(height)}</li>
            <li>Poids : {weight ? weight : "Non renseigné"}kg</li>
        </ul>
        
    </div>
    )
}