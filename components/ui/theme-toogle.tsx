"use client"
import { useEffect , useState } from "react"
import { Moon , Sun } from "lucide-react"
import { useTheme } from "next-themes"



export function ThemeToggle(){
  const {setTheme , theme} = useTheme()
  const [mounted , setMounted] = useState(false) ;

  useEffect(()=> setMounted(true) , []);

  if(!mounted) return null ;

  return (
    <div className="cursor-pointer" onClick={()=> setTheme(theme==="dark" ? "light" : "dark")} >
     {
        theme==="light" ? (<Moon className="size-5 text-black" />) : (<Sun className="size-5 text-white" />)
     }
    </div>
  )


}



