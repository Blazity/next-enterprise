"use client"
import React, { useEffect, useState } from "react"

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <button onClick={toggleTheme} className="bg-primary rounded-lg p-2 text-white transition hover:bg-primary-600">
      {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
    </button>
  )
}

export default ThemeToggle
