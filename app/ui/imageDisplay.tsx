import React from 'react'
import Image from 'next/image'

interface ImageProps {
  image?:
    | {
        data: string
        contentType: string
      }
    | string
    | null // Adicione null aqui
  className?: string
}

const ImageDisplay: React.FC<ImageProps> = ({ image, className }) => {
  if (!image) {
    return <p>Imagem não disponível</p>
  }

  let base64Image: string

  if (typeof image === 'string') {
    base64Image = image
  } else if ('data' in image && 'contentType' in image) {
    base64Image = `data:${image.contentType};base64,${image.data}`
  } else {
    return <p>Formato de imagem inválido</p>
  }

  return (
    <div>
      <Image
        loading="lazy"
        src={base64Image}
        alt="Imagem"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className={className}
      />
    </div>
  )
}

export default ImageDisplay
