import React from 'react';
import {Container, Card, Row, Col} from 'react-bootstrap';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface HomePageState {
  categories: CategoryType[];
}

class HomePage extends React.Component {
  state: HomePageState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      categories: [],
    };
  }

  componentWillMount() {
    this.getCategories();
  }

  componentWillUpdate() {
    this.getCategories();
  }

  private getCategories() {
    api('api/category/?filter=parentCategoryId||$isnull', 'get', {})
    .then((res: ApiResponse) => {
      this.putCategoriesInState(res.data);
    });
  }

  private putCategoriesInState(data: ApiCategoryDto[]) {
    const categories: CategoryType[] = data.map(category => {
      return {
        categoryId: category.categoryId,
        name: category.name,
        items: [],
      };
    });

    const newState = Object.assign(this.state, {
      categories: categories,
    });

    this.setState(newState);
  }

    render() {
    return (
      <Container>
        <RoledMainMenu role="Guest"></RoledMainMenu>
      <Card>
          <Card.Body>
              <Card.Title>
                  <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Top level categories
              </Card.Title>

              <Row>
                {this.state.categories.map(this.singleCategory)}
              </Row>
          </Card.Body>
      </Card>
   </Container>
   );
  }

  private singleCategory(category: CategoryType) {
    return (
      <Col lg="3" md="4" sm="6" xs="12">
        <Card>
          <Card.Body>
            <Card.Title as="p">{category.name}</Card.Title>
            <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm">Open category</Link>
          </Card.Body>
        </Card>
      </Col>
    );

  }

}

export default HomePage;

