import Link from "next/link"
import LogoutButton from "./LogoutButton"
import Logo from "../ui/Logo"
import Brand from "../ui/Brand"

export default function Navigation() {
  return (

    <div className="flex justify-between mt-8">
      <div className="flex items-center gap-1.25">
        <Logo/>
        <Brand/>
      </div>
      
      <nav className="flex gap-10 py-4 px-12 bg-foreground rounded-xl .type-sm" >
        <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
        <Link href="/coachAi" className="hover:text-primary">Coach AI</Link>
        <Link href="/profile" className="hover:text-primary">Mon profil</Link>
        <span className="border-r-[0.5px] border-primary"></span>
        <LogoutButton/>
      </nav>

    </div>
  )
}