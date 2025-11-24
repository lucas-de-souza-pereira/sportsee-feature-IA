

export default function WeeklyActivity({label, value, suffix, color}) {
  return (
    <article className="card py-5 px-7.5">
        <h3 className="typo-sm text-tertiary">{label}</h3>
        {color === "blue" && 
        <p className="typo-lg text-primary mt-4.5">{value}
            <span className="typo-base pl-1 text-[#B6BDFC]">{suffix}</span></p>}

        {color === "orange" && 
        <p className="typo-lg text-[#F4320B] mt-4.5">{value}
            <span className="typo-base pl-1 text-[#FCC1B6]">{suffix}</span></p>}
    </article>
  )
}