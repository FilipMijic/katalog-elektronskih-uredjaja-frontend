import React from 'react';
import { Card, Container, Col, Row, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import ArticleType from '../../types/ArticleType';
import { Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface CategoryPageProperties {
    match: {
        params: {
           cId: number; 
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
    filters: {
        keywords: string;
        priceMinimum:number;
        priceMaximum: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
        selectedFeatures: {
            featureId: number;
            value: string;
        }[];
    };
    features: {
        featureId: number;
        name: string;
        values: string[];
    }[];
}

interface CategoryDto {
    categoryId: number;
    name: string;
}

interface ArticleDto {
    articleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    manufacturer?: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;

    }[],

}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = { 
            message: '',
            filters: {
                keywords: '',
                priceMinimum: 1,
                priceMaximum: 10000,
                order: "price asc",
                selectedFeatures: [],
            },
            features: [],
        };

    }

    private setFeatures(features: any) {
        const newState = Object.assign(this.state, {
            features: features,
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));

    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories,
        }));

    }

    private setArticles(articles: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            articles: articles,
        }));

    }

    render() {
        return (
            <Container>
                <RoledMainMenu role="Guest"></RoledMainMenu>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon> {this.state.category?.name}
                        </Card.Title>
                        {this.printOptionalMessage()}

                        {this.showSubcategories()}

                        <Row>
                            <Col xs="12" lg="3" md="4">
                                {this.printFilters()}
                            </Col>

                            <Col xs="12" lg="9" md="8">
                                {this.showArticles()}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
             </Container>
        );
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMaximum: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private featureFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const featureId = Number(event.target.dataset.featureId);
        const value = event.target.value;

        if(event.target.checked) {
            this.addFeatureFilterValue(featureId, value);
        }else {
            this.removeFeatureFilterValue(featureId, value);
        }
    }

    private addFeatureFilterValue(featureId: number, value: string){
       const newSelectedFeatures = [...this.state.filters.selectedFeatures];
       newSelectedFeatures.push({
           featureId: featureId,
           value: value,
       });

       this.setSelectedFeatures(newSelectedFeatures);
    }

    private removeFeatureFilterValue(featureId: number, value: string){
        const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record => {
            return !(record.featureId === featureId && record.value === value);
        });

        this.setSelectedFeatures(newSelectedFeatures);
    }

    private setSelectedFeatures(newSelectedFeatures: any) {
        this.setState(Object.assign(this.state, {
            filters: Object.assign(this.state.filters, {
                selectedFeatures: newSelectedFeatures,
            })
        }));
    }

    private applyFilters() {
        this.getCategoryData();
    }

    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Search keywords:</Form.Label>
                   <Form.Control type="text" id="keywords" 
                   value={this.state.filters.keywords}
                   onChange= {(e) => this.filterKeywordsChanged(e as any)}>
                </Form.Control> 
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMin">Min. price:</Form.Label>
                            <Form.Control type="number" id="priceMin"
                                step="1" min="1" max="9999"
                                value={this.state.filters.priceMinimum}
                                onChange={ (e) => this.filterPriceMinChanged(e as any)}>  
                            </Form.Control>
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMax">Max. price:</Form.Label>
                            <Form.Control type="number" id="priceMax"
                                step="1" min="2" max="10000"
                                value={this.state.filters.priceMaximum}
                                onChange={ (e) => this.filterPriceMaxChanged(e as any)}>  
                            </Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder" 
                    value={this.state.filters.order}
                    onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>

                {this.state.features.map(this.printFeatureFilterComponent, this)}

                <Form.Group>
                    <Button variant="primary" block onClick={() => this.applyFilters()}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    private printFeatureFilterComponent(feature: {featureId: number; name: string; values: string[]; }) {
        return (
            <Form.Group>
                <Form.Label><strong>{feature.name}</strong></Form.Label>
                {feature.values.map(value => this.printFeatureFilterCheckbox(feature, value), this)}
            </Form.Group>
        );
    }

    private printFeatureFilterCheckbox(feature: any, value: string) {
        return (
            <Form.Check type="checkbox" label={value}
                        value={value}
                        data-feature-id={feature.featureId}
                        onChange={ (event: any) => this.featureFilterChanged(event as any)}>
            </Form.Check>
        )
    }

    private printOptionalMessage() {
        if (this.state.message !== '') {
            return;
        }

        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        );
    }

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
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

      private showArticles() {
          if (this.state.articles?.length === 0) {
              return (
                  <div>There are no articles in this category</div>
              );
          }

          return (
            <Row>
            {this.state.articles?.map(this.singleArticle)}
            </Row>
          );
      }

      private singleArticle(article: ArticleType) {
        return (
          <Col lg="4" md="6" sm="6" xs="12">
            <Card className="mb-3">
                <Card.Header>
                    <img alt={article.name}
                        src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl}
                        className="w-100"/>
                </Card.Header>
              <Card.Body>
                <Card.Title as="p"><strong>{article.name}</strong></Card.Title>
                <Card.Text>
                    {article.excerpt}
                </Card.Text>
                <Card.Text>
                    Price: {Number(article.price).toFixed(2)} EUR
                </Card.Text>
                <Link to={`/article/${article.articleId}`} className="btn btn-primary btn-block btn-sm">Open article page</Link>
              </Card.Body>
            </Card>
          </Col>
        );
    
      }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }

        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse)=> {
            if (res.status === 'error') {
                return this.setMessage('Oops, something went wrong! Please try to refresh');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);

            const subcategories: CategoryType[] = res.data.categories.map((category: CategoryDto) => {
                return {
                    categoryId: category.categoryId,
                    name: category.name,
                }

            });

            this.setSubcategories(subcategories);

        });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        const featureFilters: any[] = [];

        for (const item of this.state.filters.selectedFeatures) {
            let found = false;
            let foundRef = null;

            for (const featureFilter of featureFilters) {
                if (featureFilter.featureId === item.featureId) {
                    found = true;
                    foundRef = featureFilter;
                    break;
                }
            }

            if (!found) {
                featureFilters.push({
                    featureId: item.featureId,
                    values: [item.value],
                });
            }else {
                foundRef.values.push(item.value);
            }
        }

        api('api/article/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            features: featureFilters,
            orderBy: orderBy,
            orderDirection: orderDirection,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Oops, something went wrong! Please try to refresh')
            }

            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setArticles([]);
                return;
            }

            const articles: ArticleType[] =
            res.data.map((article: ArticleDto) => {

                const object: ArticleType = {
                articleId: article.articleId, 
                name: article.name,
                excerpt: article.excerpt,
                description: article.description,
                manufacturer: article.manufacturer,
                imageUrl: '',
                price: 1,
                };

                if (article.photos !== undefined && article.photos?.length > 0) {
                    object.imageUrl = article.photos[article.photos?.length-1].imagePath;
                }

                if (article.articlePrices !== undefined && article.articlePrices.length > 0) {
                    object.price = article.articlePrices[article.articlePrices?.length-1].price;
                }

                return object;
            });

            this.setArticles(articles);
        });

        this.getFeatures();
    }

    getFeatures() {
        api('api/feature/values/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Oops, something went wrong! Please try to refresh');
            }

            this.setFeatures(res.data.features);
        });
    }
}