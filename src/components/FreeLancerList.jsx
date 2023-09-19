import React, { useState } from 'react';
import Card from './Card';
import staffList from './staffList';
import { Button, Icon } from 'semantic-ui-react';

const CARDS_PER_ROW = 3;

const FreeLancerList = () => {
    const [numOfRows, setNumOfRows] = useState(1);

    const handleSeeMore = () => {
        setNumOfRows(prevRows => prevRows + 1);
    };

    const cardsToDisplay = staffList.slice(0, numOfRows * CARDS_PER_ROW);

    return (
        <div>
            <div className="row">
                {cardsToDisplay.map(staff => (
                    <Card 
                        key={staff.key}
                        avatar={staff.avatar}
                        name={staff.name}
                        position={staff.position}
                        rating={staff.rating}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>

            {cardsToDisplay.length < staffList.length && (
                <Button primary animated='vertical' onClick={handleSeeMore}>
                    <Button.Content visible>See More</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow down' />
                    </Button.Content>
                </Button>
            )}
            </div>
        </div>
    );
}

export default FreeLancerList;
