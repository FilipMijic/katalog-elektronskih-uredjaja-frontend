import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export class ContactPage extends React.Component {
    render() {
        return (
            <Container>
                <RoledMainMenu role="Guest"></RoledMainMenu>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                            Contact
                        </Card.Title>
                        <Card.Text>
                            Contact details that will show here
                        </Card.Text>
                    </Card.Body>
                </Card>
             </Container>
        );
            
    }

}