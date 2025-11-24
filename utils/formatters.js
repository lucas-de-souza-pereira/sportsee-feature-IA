

/**
 * Converti le genre en français
 * @param {string} gender 
 * @returns {string} "Femme ou Homme"
 */
export function formatGender(gender){
    if (!gender) return "Non renseigné"
    return gender === "female" ? "Femme" : "Homme" 
}

/**
 * Met le bon format pour la taille exemple 1m65
 * @param {int} height // 165
 * @returns {string} // 1m65
 */
export function formatHeight(height){
    if (!height) return "Non renseigné"
    const m = Math.floor(height/100)
    const c = height%100
    return `${m}m${c}`
}

/**
 * calcul heure ou minutes en fonction du paramétre 
 * exemple 75 --> 1(h) ou 15(min)
 * @param {int} minutes // 75 
 * @param {string} format // "h" ou "m"
 * @returns {int} 1(h) ou 15(min)
 */
export function formatDuration(minutes, format){
    if (!minutes) return 0
    if (format === 'h') return (Math.floor(minutes/60))
    if (format === "m") return (minutes%60)
}


/**
 * Met la date au format JJ/MM/YYYY
 * @param {date} date // 2025-11-10T08:04:00.950Z
 * @returns // 10/11/2025
 */
export function formatShortDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Met la date au format pour la date de création de profil
 * @param {string} createdAt // 2023-06-14 
 * @returns {date}  // 14 juin 2023
 */
export function formatLongDate(createdAt){
    if (createdAt === null) return ""

    const date = new Date(`${createdAt}T00:00:00`)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    
}


export function formatDayMonthDate(date){
    const d = new Date(`${date}`)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short'})
}