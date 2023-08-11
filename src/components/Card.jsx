import React from 'react'
import { Image } from 'semantic-ui-react'

import './Card.css'

const Card = (props) =>
{
    return <div className='column'>
    <img src={props.avatar} alt="Developer" />
    <h3>{props.name}</h3>
    <p>{props.position}</p>
    <div className='rating'>
    <Image src='./images/3d-star-icon.png' avatar />
    <span>{props.rating}</span>
    </div>
    </div>
}

export default Card