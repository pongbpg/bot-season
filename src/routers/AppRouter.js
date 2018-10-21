import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import OrderPage from '../components/OrderPage';
import CutOffPage from '../components/CutOffPage';
import ReportPage from '../components/ReportPage';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// import ChangePasswordPage from '../components/ChangePasswordPage';
export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/home" component={HomePage} exact={true} />
        <PrivateRoute path="/orders" component={OrderPage} exact={true} />
        <PrivateRoute path="/cutoff" component={CutOffPage} exact={true} />
        <PrivateRoute path="/report" component={ReportPage} exact={true} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
