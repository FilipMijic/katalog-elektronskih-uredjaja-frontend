import React from 'react';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import api, { ApiResponse } from '../../api/api';
import { Container, Card, Row, Col } from 'react-bootstrap';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ApiConfig } from '../../config/api.config';

interface ArticlePageProperties {
    match: {
        params: {
            aId: number;
        }
    }
}

interface FeatureData {
    name: string;
    value: string;
}

interface ArticlePageState {
    message: string;
    article?: ApiArticleDto;
    features: FeatureData[];
}

export default class ArticlePage extends React.Component<ArticlePageProperties> {
    state: ArticlePageState;

    constructor(props: Readonly<ArticlePageProperties>) {
        super(props);

        this.state = {
            message: '',
            features: [],
        };
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });
    
        this.setState(newState);
    
    
    }

    private setArticleData(articleData: ApiArticleDto | undefined) {
        const newState = Object.assign(this.state, {
            article: articleData,
        });
    
        this.setState(newState);
    
    
    }

    private setFeatureData(features: FeatureData[]) {
        const newState = Object.assign(this.state, {
            features: features,
        });
    
        this.setState(newState);
    
    
    }

    componentDidMount() {
        this.getArticleData();
    }

    componentDidUpdate(oldProperties: ArticlePageProperties) {
        if (oldProperties.match.params.aId === this.props.match.params.aId) {
            return;
        }

        this.getArticleData();
    }

    getArticleData() {
        api('/api/article/' + this.props.match.params.aId, 'get', {})
        .then((res: ApiResponse)=> {
            if (res.status === 'error') {
                this.setArticleData(undefined);
                this.setFeatureData([]);
                this.setMessage('This article does not exist');
                return;
            }

            const data: ApiArticleDto = res.data;

            this.setMessage('');
            this.setArticleData(data);

            const features: FeatureData[] = [];
            
            for (const articleFeature of data.articleFeatures) {
                const value = articleFeature.value;
                let name = '';

                for (const feature of data.features) {
                    if (feature.featureId === articleFeature.featureId) {
                        name = feature.name;
                        break;
                    }
                }

                features.push({name, value});
            }

            this.setFeatureData(features);
        });
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        );
    }

    render() {
        return (
            <Container>
                <RoledMainMenu role="Guest"></RoledMainMenu>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faBoxOpen}></FontAwesomeIcon> {
                            this.state.article ?
                            this.state.article?.name :
                            'Article not found'

                            }
                        </Card.Title>

                        {this.printOptionalMessage()}

                        {
                            this.state.article ?
                                (this.renderArticleData(this.state.article)) :
                                ''
                        }
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    renderArticleData(article: ApiArticleDto) {
        return (
                        <Row>
                            <Col xs="12" lg="8">
                                <div className="excerpt">
                                    {article.excerpt}
                                </div>

                                <hr/>

                                <div className="description">
                                    {article.description}
                                </div>

                                <hr/>

                                <b>Features:</b><br/>

                                <ul>
                                    {this.state.features.map(feature => (
                                        <li>
                                            {feature.name}: {feature.value}
                                        </li>
                                    ), this)}
                                </ul>
                            </Col>

                            <Col xs="12" lg="4">
                                <Row>
                                    <Col xs="12" className="mb-3">
                                        <img alt={'Image -' + article.photos[0].photoId}
                                            src={ApiConfig.PHOTO_PATH + 'small/' + article.photos[0].imagePath}
                                            className="w-100"></img>
                                    </Col>
                                </Row>

                                <Row>
                                    {article.photos.slice(1).map(photo => (
                                        <Col xs="12" sm="6">
                                        <img alt={'Image -' + photo.photoId}
                                            src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath}
                                            className="w-100 mb-3"></img>
                                    </Col>
                                    ), this)}
                                </Row>

                                <Row>
                                    <Col xs="12" className="text-center mb-3">
                                        <b>
                                        Price: {
                                            Number(article.articlePrices[article.articlePrices.length-1].price).toFixed(2) + ' EUR'}
                                        </b>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                );
            }
        }

