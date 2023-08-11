import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Card from './Card';
import fakeCustomer from './fakeCustomer';

const CARDS_PER_ROW = 3;

const CustomerList = () => {
    const [numOfRows, setNumOfRows] = useState(1);

    const handleSeeMore = () => {
        setNumOfRows(prevRows => prevRows + 1);
    };

    const cardsToDisplay = fakeCustomer.slice(0, numOfRows * CARDS_PER_ROW);

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
            {cardsToDisplay.length < fakeCustomer.length && (
                <Button primary animated='vertical' onClick={handleSeeMore}>
                    <Button.Content visible>See More</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow down' />
                    </Button.Content>
                </Button>
            )}
        </div>
    );
}

export default CustomerList;
