import React from 'react'
import { Image } from 'semantic-ui-react'

const ImageFluid = () => (
    <div style={{
      display: 'flex',
      backgroundColor: 'rgba(173, 168, 168, 0.379)',
      padding: '10px',
      //border: '1px solid black'
    }}>
      <Image 
        src='images/Background.png' 
        fluid 
        style={{
          height: '200px',
          width: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  )
  

export default ImageFluid