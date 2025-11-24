import Brand from "@/components/ui/Brand";
import Logo from "@/components/ui/Logo";

import Footer from "@/components/footer/Footer";

import Link from "next/link";

export default function NotFound(){
    return(
    <div className="min-h-screen flex flex-col">
        <div className="w-[90%] xl:w-[1140px] m-auto bg-background flex-1 flex flex-col">

            <Link href="/dashboard" className="hover:cursor-pointer flex items-center gap-1.25 mt-8 py-4">
                        <Logo/>
                        <Brand/>
            </Link>


        <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl p-6 pt-0">Erreur 404</h1>
        <p>La page que vous recherchez semble introuvable.</p>
        </div>
   
        </div>
    <Footer/>
    </div>
    )
}