import React from 'react';
import {Container, Card} from 'react-bootstrap';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardState {
  isAdministratorLoggedIn: boolean;
}

class AdministratorDashboard extends React.Component {
  state: AdministratorDashboardState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
    };
  }

  componentWillMount() {
      this.getMyData();
  }

  componentWillUpdate() {
    this.getMyData();
  }

  private getMyData() {
      api ('api/administrator/', 'get', {})
      .then((res: ApiResponse) => {
          if (res.status === "error" || res.status === "login") {
              this.setLoggedInState(false);
              return;
          }
      });
  }

  private setLoggedInState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
  }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
    return (
        <Redirect to="/auth/login"></Redirect>
        );
    }

    return (
        <Container>
          <RoledMainMenu role="Admin"></RoledMainMenu>
        <Card>
          <Card.Body>
              <Card.Title>
                  <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Administrator Dashboard
              </Card.Title>
              <ul>
                <li><Link to="/administrator/dashboard/category/">Categories</Link></li>
                <li><Link to="/administrator/dashboard/article/">Articles</Link></li>
              </ul>
          </Card.Body>
        </Card>
        </Container>
    );
}

}

export default AdministratorDashboard;

