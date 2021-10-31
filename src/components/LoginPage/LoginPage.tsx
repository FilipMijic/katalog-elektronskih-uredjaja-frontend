import React from 'react';
import { Container, Card, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface LoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export class LoginPage extends React.Component {
    state: LoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        api(
            'auth/login',
            'post',
            {
                username: this.state.username,
                password: this.state.password,
            }
        )
        .then((res: ApiResponse) => {
            if ( res.status === 'error') {
            this.setErrorMessage('System error... Try again!');

            return;
        }

        if(res.status === 'ok') {
            if (res.data.statusCode !== undefined) {
                let message= '';

                switch (res.data.statusCode) {
                    case -1003: message = 'Unknown username!'; break;
                    case -1004: message = 'Bad password'; break;
                }

                this.setErrorMessage(message);

                return;
            }

            saveToken(res.data.token);
            console.log(res.data.token);

        this.setLoginState(true);

        }

    });
}


    render() {
        if (this.state.isLoggedIn === true) {
        return (
            <Redirect to ="/administrator/dashboard"></Redirect>
        );
            
    }

    return (
        <Container>
            <RoledMainMenu role="Guest"></RoledMainMenu>
            <Col md= {{span: 6, offset: 3}}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon> Administrator Login
                        </Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label htmlFor="username">Username:</Form.Label>
                                <Form.Control type="username" id="username" 
                                                value={this.state.username}
                                                onChange={event => this.formInputChanged(event as any)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="password">Password:</Form.Label>
                                <Form.Control type="password" id="password" 
                                                value={this.state.password}
                                                onChange={event => this.formInputChanged(event as any)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" onClick={() => this.doLogin()}>Log in</Button>
                            </Form.Group>
                        </Form>
                        <Alert variant="danger" 
                                className={this.state.errorMessage ? '' : 'd-none'}>
                                {this.state.errorMessage}
                        </Alert>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}
}