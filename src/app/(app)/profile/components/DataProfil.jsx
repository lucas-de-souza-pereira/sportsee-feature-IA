


export default function DataProfil({label, value, suffix}) {
  return (
    <article className="bg-primary rounded-sm py-5 px-7.5 text-foreground  w-69.5">
        <h3 className="typo-sm">{label}</h3>
        <p className="typo-lg mt-4.5">{value}
            <span className="typo-base pl-1 text-[#B6BDFC]">{suffix}</span>
        </p>
    </article>
  )
}