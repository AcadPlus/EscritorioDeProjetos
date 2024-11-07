import React from 'react'
import Image from 'next/image'

const ImageDisplay = ({ image, className }) => {
  if (!image || !image.data) {
    return <p>Imagem não disponível</p>
  }
  const base64Image = `data:${image.contentType};base64,${image.data}`

  return (
    <div>
      <Image
        loading="lazy"
        src={base64Image}
        alt="Imagem"
        width={0}
        height={0}
        className={className}
      />
    </div>
  )
}

export default ImageDisplay
