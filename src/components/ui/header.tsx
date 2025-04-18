"use client"

import { Button } from "./button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { label: "Início", href: "#" },
    { label: "Recursos", href: "#recursos" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Planos", href: "#planos" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f]/95 backdrop-blur-sm border-b border-[#233554]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/TAPPY - SOMENTE A LOGO - VERDE.svg"
              alt="Tappy ID"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex space-x-4">
            <Button
              className="bg-[#17d300] hover:bg-[#15bb00] text-white"
              onClick={() => window.location.href = "/registro"}
            >
              Começar Agora
            </Button>
            <Button
              className="bg-white hover:bg-gray-100 text-[#17d300] border border-[#17d300]"
              onClick={() => window.location.href = "/login"}
            >
              Conectar-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={toggleMenu}
                >
                  {item.label}
                </a>
              ))}
              <Button
                className="bg-[#17d300] hover:bg-[#15bb00] text-white w-full"
                onClick={() => {
                  window.location.href = "#planos"
                  setIsMenuOpen(false)
                }}
              >
                Começar Agora
              </Button>
              <Button
              className="bg-white hover:bg-gray-100 text-[#17d300] border border-[#17d300]"
              onClick={() => window.location.href = "/login"}
            >
              Conectar-se
            </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
