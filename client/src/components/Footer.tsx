import React from 'react'
import { ContextAPI } from '../context/ContextAPI'
import { checkIsAuthenticated } from '../services/auth/isAuthenticated';

export const Footer = () => {
  const isAuthenticated = checkIsAuthenticated();
  return (
    <footer className={`${!isAuthenticated ? "bottom-0" : ""} text-center md:text-left mt-5`}>
    © 2022 PERN CRM<span className="inline-block w-full text-center md:float-right md:w-auto">Coded with ❤️ by <a href='https://www.linkedin.com/in/pascal-alhadoum-7454a5a4/' target={"_blank"} className="text-[#6c757d]">Pascal ALHADOUM</a></span>
    </footer>
  )
}
