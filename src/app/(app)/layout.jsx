

import Footer from "../../components/footer/Footer"
import Navigation from "../../components/nav/Navigation"

import Provider from "./Provider"

export default function RecipesLayout({children}) {
  return (

  <div className="min-h-screen flex flex-col">

    <div className="w-[90%] xl:w-[1140px] m-auto bg-background flex-1" >

      <div className="">
        <Navigation/>
      </div>
      
        <Provider>
          <main className="w-full m-auto">
            {children}
          </main>
        </Provider>
    </div>

    <Footer/>
  </div>
  )
}