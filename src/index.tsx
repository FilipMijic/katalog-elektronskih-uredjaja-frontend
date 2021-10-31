import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { Switch, Route, HashRouter } from 'react-router-dom';
import HomePage from './components/Homepage/HomePage';
import { ContactPage } from './components/ContactPage/ContactPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardFeature from './components/AdministratorDashboardFeature/AdministratorDashboardFeature';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle/AdministratorDashboardArticle';
import AdministratorDashboardPhoto from './components/AdministratorDashboardPhoto/AdministratorDashboardPhoto';
import ArticlePage from './components/ArticlePage/ArticlePage';
import { LogoutPage } from './components/LogoutPage/LogoutPage';



ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact" component={ContactPage}></Route>
        <Route path="/auth/login" component={LoginPage}></Route>
        <Route path="/administrator/logout" component={LogoutPage}></Route>
        <Route path="/category/:cId" component={CategoryPage}></Route>
        <Route path="/article/:aId" component={ArticlePage}></Route>
        <Route exact path="/administrator/dashboard/" component={AdministratorDashboard}></Route>
        <Route path="/administrator/dashboard/category/" component={AdministratorDashboardCategory}></Route>
        <Route path="/administrator/dashboard/feature/:cId" component={AdministratorDashboardFeature}></Route>
        <Route path="/administrator/dashboard/article/" component={AdministratorDashboardArticle}></Route>
        <Route path="/administrator/dashboard/photo/:aId" component={AdministratorDashboardPhoto}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
