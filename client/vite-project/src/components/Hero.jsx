import React from 'react'

export default function Hero() {
  return (
    <div className={`
    bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
    flex flex-col justify-center items-center gap-8 text-white
    h-full py-12 px-3
    md:h-100 md:p-2
    `}>
      <h1 className={`font-semibold 
      text-3xl 
      md:text-5xl
        `}>Find Everything You Need</h1>
      <p className={`text-lg md:text-xl text-center`}>Shop from thousands of products across multiple vendors</p>
    </div>
  )
}
