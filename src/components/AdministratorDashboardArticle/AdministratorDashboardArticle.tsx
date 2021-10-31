import React from 'react';
import {Container, Card, Table, Button, Modal, Form, Alert, Row, Col} from 'react-bootstrap';
import {faListAlt, faPlus, faEdit, faSave, faImage, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorDashboardArticleState {
  isAdministratorLoggedIn: boolean;
  articles: ArticleType[];
  categories: CategoryType[];

  addModal: {
    visible: boolean;
    message: string;

    name: string;
    categoryId: number;
    excerpt: string;
    description: string;
    manufacturer: string;
    price: number;
    features: {
      use: number;
      featureId: number;
      name: string;
      value: string;
    }[];

  };

  editModal: {
    visible: boolean;
    message: string;

    articleId?: number;
    name: string;
    categoryId: number;
    excerpt: string;
    description: string;
    manufacturer: string;
    price: number;
    features: {
      use: number;
      featureId: number;
      name: string;
      value: string;
    }[];
  };
}

interface FeatureBaseType {
  featureId: number;
  name:string;
}

class AdministratorDashboardArticle extends React.Component {
  state: AdministratorDashboardArticleState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      articles: [],
      categories: [],

      addModal: {
        visible: false,
        message: '',

        name: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        manufacturer: '',
        price: 1,
        features: [],
      },

      editModal: {
        visible: false,
        message: '',

        name: '',
        categoryId: 1,
        excerpt: '',
        description: '',
        manufacturer: '',
        price: 1,
        features: [],
      },
    };
  }

  private setAddModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, { 
        visible: newState,
      })
    ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, { 
        [fieldName]: newValue,
      })
    ));
  }

  private setAddModalNumberFieldState(fieldName: string, newValue: any) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, { 
        [fieldName]: (newValue === 'null') ? null : Number(newValue),
      })
    ));
  }

  private setAddModalFeatureUse(featureId: number, use: boolean) {
    const addFeatures: {featureId: number; use: number;}[] = [...this.state.addModal.features];
    for (const feature of addFeatures) {
      if (feature.featureId === featureId) {
        feature.use = use ? 1 : 0;
        break;
      }
    }
    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
        }),
      ));
  }

  private setAddModalFeatureValue(featureId: number, value: string) {
    const addFeatures: {featureId: number; value: string;}[] = [...this.state.addModal.features];
    for (const feature of addFeatures) {
      if (feature.featureId === featureId) {
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: addFeatures,
        }),
      ));
  }

  private setEditModalFeatureUse(featureId: number, use: boolean) {
    const editFeatures: {featureId: number; use: number;}[] = [...this.state.editModal.features];
    for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
        feature.use = use ? 1 : 0;
        break;
      }
    }
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
        }),
      ));
  }

  private setEditModalFeatureValue(featureId: number, value: string) {
    const editFeatures: {featureId: number; value: string;}[] = [...this.state.editModal.features];
    for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
        feature.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: editFeatures,
        }),
      ));
  }

  private setEditModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, { 
        visible: newState,
      })
    ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, { 
        [fieldName]: newValue,
      })
    ));
  }

  private setEditModalNumberFieldState(fieldName: string, newValue: any) {
    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, { 
        [fieldName]: (newValue === 'null') ? null : Number(newValue),
      })
    ));
  }

  componentDidMount() {
    this.getCategories();
    this.getArticles();
}

private async getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]> {
  return new Promise(resolve => {
    api('/api/feature/?filter=categoryId||$eq||' + categoryId + '/', 'get', {})
    .then((res: ApiResponse) => {
      if (res.status === "error" || res.status === "login") {
          this.setLoggedInState(false);
          return resolve([]);
      }

      const features: FeatureBaseType[] = res.data.map((item: any) => ({
        featureId: item.featureId,
        name: item.name,
      }));

      resolve(features);

    })
  })
}

private getCategories() {
  api ('api/category/', 'get', {})
  .then((res: ApiResponse) => {
      if (res.status === "error" || res.status === "login") {
          this.setLoggedInState(false);
          return;
      }

      this.putCategoriesInState(res.data);
  });
}

private putCategoriesInState(data: ApiCategoryDto[]) {
  const categories: CategoryType[] = data.map(category => {
    return {
      categoryId: category.categoryId,
      name: category.name,
      imagePath: category.imagePath,
      parentCategoryId: category.parentCategoryId,
    };
  });

  this.setState(Object.assign(this.state, {
    categories: categories,
  }));
}

  private getArticles() {
      api ('api/article/?join=articleFeatures&join=features&join=articlePrices&join=photos&join=category', 'get', {})
      .then((res: ApiResponse) => {
          if (res.status === "error" || res.status === "login") {
              this.setLoggedInState(false);
              return;
          }

          this.putArticlesInState(res.data);
      });
  }

  private putArticlesInState(data?: ApiArticleDto[]) {
    const articles: ArticleType[] | undefined = data?.map(article => {
      if (article.photos.length !== 0)
      {
      return {
        articleId: article.articleId,
        name: article.name,
        excerpt: article.excerpt,
        description: article.description,
        manufacturer: article.manufacturer,
        imageUrl: article.photos[0].imagePath,
        price: article.articlePrices[article.articlePrices.length-1].price,
        articleFeatures: article.articleFeatures,
        features: article.features,
        articlePrices: article.articlePrices,
        photos: article.photos,
        category: article.category,
        categoryId: article.categoryId,
      };
    }else {
      return {
        articleId: article.articleId,
        name: article.name,
        excerpt: article.excerpt,
        description: article.description,
        manufacturer: article.manufacturer,
        price: article.articlePrices[article.articlePrices.length-1].price,
        articleFeatures: article.articleFeatures,
        features: article.features,
        articlePrices: article.articlePrices,

        category: article.category,
        categoryId: article.categoryId,
      };
    }

    });

    const newState = Object.assign(this.state, {
      articles: articles,
    });

    this.setState(newState);
  }

  private setLoggedInState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
  }

  private async setAddModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setAddModalNumberFieldState('categoryId', event.target.value);

    const features = await this.getFeaturesByCategoryId(this.state.addModal.categoryId);
    const stateFeatures = features.map(feature => ({
      featureId: feature.featureId,
      name: feature.name,
      value: '',
      use: 0,
    }));

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
       features: stateFeatures,
        }), 
    ));
  }

    render() {
      console.log(this.state.isAdministratorLoggedIn);
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
                  <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon> Articles
              </Card.Title>
              <Table hover size="sm" bordered>
                <thead>
                  <tr>
                    <th colSpan={ 5 }></th>
                    <th className="text-center">
                      <Button variant="primary" size="sm"
                        onClick={() => this.showAddModal()}>
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        Add
                      </Button>
                      </th>
                  </tr>
                  <tr>
                    <th className="text-right">Id</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Manufacturer</th>
                    <th className="text-right">Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.articles.map(article => (
                    <tr>
                      <td className="text-right">{article.articleId}</td>
                      <td>{article.name}</td>
                      <td>{article.category?.name}</td>
                      <td>{article.manufacturer}</td>
                      <td className="text-right">{article.price}</td>
                      <td className="text-center">
                        <Link to={"/administrator/dashboard/photo/" + article.articleId}
                                className="btn btn-sm btn-info mr-3">
                                <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
                                Photos
                        </Link>
                        <Button className="mr-2" variant="info" size="sm"
                          onClick={() => this.showEditModal(article)}>
                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        Edit
                        </Button>
                        <Button variant="danger" size="sm"
                          onClick={() => this.doDeleteArticle(article)}>
                        <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                        Delete
                        </Button>
                      </td>
                    </tr>
                    ), this)}
                </tbody>
              </Table>
          </Card.Body>
        </Card>

        <Modal size="lg" centered show={this.state.addModal.visible} 
          onHide={() => this.setAddModalVisibleState(false)}
          onEntered={() => {
            if(document.getElementById('add-photo')) {
              const filePicker: any = document.getElementById('add-photo');
              filePicker.value = '';
            }
           }}>
          <Modal.Header closeButton>
            <Modal.Title>Add new article</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group>
              <Form.Label htmlFor="add-categoryId">Category</Form.Label>
              <Form.Control id="add-categoryId" as="select" value={this.state.addModal.categoryId?.toString()}
                onChange={(e) => this.setAddModalCategoryChanged(e as any)}>
                  {this.state.categories.map(category => (
                    <option value={category.categoryId?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-name">Name</Form.Label>
              <Form.Control id="add-name" type="text" value={this.state.addModal.name}
                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
              <Form.Control id="add-excerpt" type="text" value={this.state.addModal.excerpt}
                onChange={(e) => this.setAddModalStringFieldState('excerpt', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-description">Description</Form.Label>
              <Form.Control id="add-description" as="textarea" value={this.state.addModal.description}
                onChange={(e) => this.setAddModalStringFieldState('description', e.target.value)}
                rows={ 10 }>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-manufacturer">Manufacturer</Form.Label>
              <Form.Control id="add-manufacturer" type="text" value={this.state.addModal.manufacturer}
                onChange={(e) => this.setAddModalStringFieldState('manufacturer', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="add-price">Price</Form.Label>
              <Form.Control id="add-price" type="number" min={ 1 } step={ 1 } value={this.state.addModal.price}
                onChange={(e) => this.setAddModalNumberFieldState('price', e.target.value)}>
                </Form.Control>
            </Form.Group>

              <div>
                {this.state.addModal.features.map(this.printAddModalFeatureInput, this)}
              </div>

              <Form.Group>
                <Form.Label htmlFor="add-photo">Article photo</Form.Label>
               <Form.File id="add-photo"></Form.File>
              </Form.Group>

            <Form.Group>
              <Button variant="primary" onClick={() => this.doAddArticle()}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                Add new article
              </Button>
            </Form.Group>
            {this.state.addModal.message ? (
              <Alert variant="danger" value={this.state.addModal.message}></Alert>
            ) : ''}
          </Modal.Body>
        </Modal>

        <Modal size="lg" centered show={this.state.editModal.visible} 
          onHide={() => this.setEditModalVisibleState(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit article</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="edit-name">Name</Form.Label>
              <Form.Control id="edit-name" type="text" value={this.state.editModal.name}
                onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-excerpt">Short text</Form.Label>
              <Form.Control id="edit-excerpt" type="text" value={this.state.editModal.excerpt}
                onChange={(e) => this.setEditModalStringFieldState('excerpt', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-description">Description</Form.Label>
              <Form.Control id="edit-description" as="textarea" value={this.state.editModal.description}
                onChange={(e) => this.setEditModalStringFieldState('description', e.target.value)}
                rows={ 10 }>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-manufacturer">Manufacturer</Form.Label>
              <Form.Control id="edit-manufacturer" type="text" value={this.state.editModal.manufacturer}
                onChange={(e) => this.setEditModalStringFieldState('manufacturer', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="edit-price">Price</Form.Label>
              <Form.Control id="edit-price" type="number" min={ 1 } step={ 1 } value={this.state.editModal.price}
                onChange={(e) => this.setEditModalNumberFieldState('price', e.target.value)}>
                </Form.Control>
            </Form.Group>

              <div>
                {this.state.editModal.features.map(this.printEditModalFeatureInput, this)}
              </div>

            <Form.Group>
              <Button variant="primary" onClick={() => this.doEditArticle()}>
                <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                Edit article
              </Button>
            </Form.Group>
            {this.state.editModal.message ? (
              <Alert variant="danger" value={this.state.editModal.message}></Alert>
            ) : ''}
          </Modal.Body>
        </Modal>
        </Container>
    );
}

  private printAddModalFeatureInput(feature: any) {
    return (
      <Form.Group>
        <Row>
          <Col xs="4" sm="1" className="text-center">
            <input type="checkbox" value="1" checked={feature.use === 1}
              onChange={(e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked)}>
          
            </input>
          </Col>
          <Col xs="8" sm="3">
            {feature.name}
          </Col>
          <Col xs="12" sm="8">
          <Form.Control type="text" value={feature.value}
            onChange={(e) => this.setAddModalFeatureValue(feature.featureId, e.target.value)}>
        
          </Form.Control>
          </Col>
        </Row>
      </Form.Group>
    );
  }

  private printEditModalFeatureInput(feature: any) {
    return (
      <Form.Group>
        <Row>
          <Col xs="4" sm="1" className="text-center">
            <input type="checkbox" value="1" checked={feature.use === 1}
              onChange={(e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked)}>
          
            </input>
          </Col>
          <Col xs="8" sm="3">
            {feature.name}
          </Col>
          <Col xs="12" sm="8">
          <Form.Control type="text" value={feature.value}
            onChange={(e) => this.setEditModalFeatureValue(feature.featureId, e.target.value)}>
        
          </Form.Control>
          </Col>
        </Row>
      </Form.Group>
    );
  }

  private showAddModal() {
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('excerpt', '');
    this.setAddModalStringFieldState('description', '');
    this.setAddModalStringFieldState('manufacturer', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalNumberFieldState('categoryId', '1');
    this.setAddModalStringFieldState('price', '1');

    this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
        features: [],
      }),
    ));

    this.setAddModalVisibleState(true);
  }

  
  private doAddArticle() {
    const filePicker: any = document.getElementById('add-photo');

    if (filePicker?.files.length === 0) {
        this.setAddModalStringFieldState('message', 'You must select a file to upload!');
        return;
    }

    api('/api/article', 'post', {
      categoryId: this.state.addModal.categoryId,
      name: this.state.addModal.name,
      excerpt: this.state.addModal.excerpt,
      description: this.state.addModal.description,
      manufacturer: this.state.addModal.manufacturer,
      price: this.state.addModal.price,
      features: this.state.addModal.features
        .filter(feature => feature.use === 1)
        .map(feature => ({
        featureId: feature.featureId,
        value: feature.value
      })),
    })
    .then(async (res: ApiResponse) => {
      console.log(res.status);
      if (res.status === "login") {
        this.setLoggedInState(false);
        return;
      }

      if (res.status === "error") {
        this.setAddModalStringFieldState('message', res.data);
        return;
      }

      const articleId: number = res.data.articleId;

      const file = filePicker.files[0];
      await this.uploadArticlePhoto(articleId, file);

      this.setAddModalVisibleState(false);
      this.getArticles();
    });
  }

  private async uploadArticlePhoto(articleId: number, file: File) {
    return await apiFile('/api/article/' + articleId + '/uploadPhoto', 'photo', file);
  }

  private async doDeleteArticle(article: ArticleType) {
    await api('/api/article/delete/' + article.articleId, 'delete',{} );
    this.getArticles();
  }

  private async showEditModal(article: ArticleType) {
    this.setEditModalNumberFieldState('articleId', article.articleId);
    this.setEditModalStringFieldState('name', String(article.name));
    this.setEditModalStringFieldState('message', '');
    this.setEditModalStringFieldState('excerpt', String(article.excerpt));
    this.setEditModalStringFieldState('description', String(article.description));
    this.setEditModalStringFieldState('manufacturer', String(article.manufacturer));
    this.setEditModalNumberFieldState('price', article.price);

    if (!article.categoryId) {
      return;
    }

    const categoryId: number = article.categoryId;

    const allFeatures: any[] = await this.getFeaturesByCategoryId(categoryId);
    for (const apiFeature of allFeatures) {
        apiFeature.use = 0;
        apiFeature.value = '';

      if (!article.articleFeatures) {
        continue;
      }

      for (const articleFeature of article.articleFeatures) {
        if (articleFeature.featureId === apiFeature.featureId) {
          apiFeature.use = 1;
          apiFeature.value = articleFeature.value;
        }
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
        features: allFeatures,
      }),
    ));

    this.setEditModalVisibleState(true);
  }

  private doEditArticle() {
    api('/api/article/' + this.state.editModal.articleId, 'patch', {
      name: this.state.editModal.name,
      excerpt: this.state.editModal.excerpt,
      description: this.state.editModal.description,
      manufacturer: this.state.editModal.manufacturer,
      price: this.state.editModal.price,
      features: this.state.editModal.features
        .filter(feature => feature.use === 1)
        .map(feature => ({
        featureId: feature.featureId,
        value: feature.value
      })),
    })
    .then((res: ApiResponse) => {
      console.log(res.status);
      if (res.status === "login") {
        this.setLoggedInState(false);
        return;
      }

      if (res.status === "error") {
        this.setEditModalStringFieldState('message', res.data);
        return;
      }

      this.setEditModalVisibleState(false);
      this.getArticles();
    });
  }

}

export default AdministratorDashboardArticle;

