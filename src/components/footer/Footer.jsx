import Logo from "../ui/Logo"

export default function Footer() {
  return (
    <div className="w-full bg-foreground ">

        <footer className="flex justify-between items-center  py-2.5 px-25 typo-sm max-w-[1440px] m-auto">
            
        <div className="flex items-center gap-2.25  ">
            <p>©Sportsee</p>
            <p>Tous droits réservés</p>
        </div>

        <div className="flex  items-center gap-4">
            <p>Conditions générales</p>
            <p>Contact</p>
            <Logo/>
        </div>
        </footer>

    </div>
  )
}