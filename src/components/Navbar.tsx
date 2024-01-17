import { FC } from 'react'
import { BsGithub } from 'react-icons/bs'
import { TbTrademark } from 'react-icons/tb'

interface NavbarProps {
  
}

export default function Navbar({}){
    return (
        <div className='flex justify-between px-8 md:justify-evenly md:px-0 py-5 text-slate-800'>
            <h1 className='text-3xl font-bold'>Lotería</h1>
            <div className='flex gap-3 mt-2'>
                <BsGithub className='text-xl md:text-2xl'></BsGithub>
                <h1 className='md:text-xl font-light flex'>ACBerny22<TbTrademark className='md:text-xl'></TbTrademark></h1>
            </div>
        </div>
    )
}
