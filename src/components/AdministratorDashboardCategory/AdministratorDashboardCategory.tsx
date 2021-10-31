import React from 'react';
import {Container, Card, Table, Button, Modal, Form, Alert} from 'react-bootstrap';
import {faListAlt, faPlus, faEdit, faListUl, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorDashboardCategoryState {
  isAdministratorLoggedIn: boolean;
  categories: CategoryType[];

  addModal: {
    visible: boolean;
    name: string;
    imagePath: string;
    parentCategoryId: number | null;
    message: string;
  };

  editModal: {
    categoryId?: number;
    visible: boolean;
    name: string;
    imagePath: string;
    parentCategoryId: number | null;
    message: string;
  };
}

class AdministratorDashboardCategory extends React.Component {
  state: AdministratorDashboardCategoryState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      categories: [],

      addModal: {
        visible: false,
        name: '',
        imagePath: '',
        parentCategoryId: null,
        message: '',
      },

      editModal: {
        visible: false,
        name: '',
        imagePath: '',
        parentCategoryId: null,
        message: '',
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

  componentWillMount() {
    this.getCategories();
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

    const newState = Object.assign(this.state, {
      categories: categories,
    });

    this.setState(newState);
  }

  private setLoggedInState(isLoggedIn: boolean) {
    this.setState(Object.assign(this.state, {
      isAdministratorLoggedIn: isLoggedIn,
    }));
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
                  <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon> Categories
              </Card.Title>
              <Table hover size="sm" bordered>
                <thead>
                  <tr>
                    <th colSpan={ 3 }></th>
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
                    <th className="text-right">Parent Id</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.categories.map(category => (
                    <tr>
                      <td className="text-right">{category.categoryId}</td>
                      <td>{category.name}</td>
                      <td className="text-right">{category.parentCategoryId}</td>
                      <td className="text-center">
                        <Link to={"/administrator/dashboard/feature/" + category.categoryId}
                              className="btn btn-sm btn-info mr-2">
                            <FontAwesomeIcon icon={faListUl}></FontAwesomeIcon>
                            Features
                        </Link>
                        <Button className= "mr-2" variant="info" size="sm"
                          onClick={() => this.showEditModal(category)}>
                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        Edit
                        </Button>
                        <Button variant="danger" size="sm"
                          onClick={() => this.doDeleteCategory(category)}>
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

        <Modal size="lg" centered show={this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add new category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control id="name" type="text" value={this.state.addModal.name}
                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={this.state.addModal.parentCategoryId?.toString()}
                onChange={(e) => this.setAddModalNumberFieldState('parentCategoryId', e.target.value)}>
                  <option value="null">No parent category</option>
                  {this.state.categories.map(category => (
                    <option value={category.categoryId?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={() => this.doAddCategory()}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                Add new category
              </Button>
            </Form.Group>
            {this.state.addModal.message ? (
              <Alert variant="danger" value={this.state.addModal.message}></Alert>
            ) : ''}
          </Modal.Body>
        </Modal>

        <Modal size="lg" centered show={this.state.editModal.visible} onHide={() => this.setEditModalVisibleState(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control id="name" type="text" value={this.state.editModal.name}
                onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)}>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parentCategoryId">Parent category</Form.Label>
              <Form.Control id="parentCategoryId" as="select" value={this.state.editModal.parentCategoryId?.toString()}
                onChange={(e) => this.setEditModalNumberFieldState('parentCategoryId', e.target.value)}>
                  <option value="null">No parent category</option>
                  {this.state.categories
                      .filter(category => category.categoryId !== this.state.editModal.categoryId)
                      .map(category => (
                    <option value={category.categoryId?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" onClick={() => this.doEditCategory()}>
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                Edit category
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

private async doDeleteCategory(category: CategoryType) {
  await api('/api/category/delete/' + category.categoryId, 'delete',{} );
  this.getCategories();
}

  private showAddModal() {
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('imagePath', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalNumberFieldState('parentCategoryId', 'null');
    this.setAddModalVisibleState(true);
  }

  private doAddCategory() {
    api('/api/category/', 'post', {
      name: this.state.addModal.name,
      imagePath: this.state.addModal.imagePath,
      parentCategoryId: this.state.addModal.parentCategoryId,
    })
    .then((res: ApiResponse) => {
      if (res.status === "login") {
        this.setLoggedInState(false);
        return;
      }

      if (res.status === "error") {
        this.setAddModalStringFieldState('message', res.data);
        return;
      }

      this.setAddModalVisibleState(false);
      this.getCategories();
    });
  }

  private showEditModal(category: CategoryType) {
    this.setEditModalStringFieldState('name', String(category.name));
    this.setEditModalStringFieldState('imagePath', String(category.imagePath));
    this.setEditModalStringFieldState('message', '');
    this.setEditModalNumberFieldState('parentCategoryId', category.parentCategoryId);
    this.setEditModalNumberFieldState('categoryId', category.categoryId);
    this.setEditModalVisibleState(true);
  }

  private doEditCategory() {
    api('/api/category/' + this.state.editModal.categoryId, 'patch', {
      name: this.state.editModal.name,
      imagePath: this.state.editModal.imagePath,
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
      this.getCategories();
    });

    api('/api/category/' + this.state.editModal.categoryId, 'patch', {
      name: this.state.editModal.name,
      imagePath: this.state.editModal.imagePath,
      parentCategoryId: this.state.editModal.parentCategoryId,
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
      this.getCategories();
    });
  }

}

export default AdministratorDashboardCategory;

