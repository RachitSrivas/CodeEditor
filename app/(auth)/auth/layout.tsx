import React from 'react'
import Image from 'next/image'

const AuthLayout = ({children} : {children:React.ReactNode})=>{
    return (
        <main className="flex justify-center items-center h-screen flex-col bg-zinc-800">
            {children}
        </main>
    )
}

export default AuthLayout;
