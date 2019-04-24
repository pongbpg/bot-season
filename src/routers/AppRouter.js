import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import OrderPage from '../components/OrderPage';
import CutOffPage from '../components/CutOffPage';
import ReportPage from '../components/ReportPage';
import TrackingPage from '../components/TrackingPage';
import TrackEditPage from '../components/TrackEditPage';
import SayHiPage from '../components/SayHiPage';
import CostPage from '../components/CostPage';
import VotesPage from '../components/games/Votes';
import AdminsPage from '../components/manage/AdminsPage';
import EmailsPage from '../components/manage/emails/IndexPage';
import TeamsPage from '../components/manage/teams/IndexPage';
import EmailPage from '../components/manage/emails/EditPage';
import PostsPage from '../components/widget/PostsPage';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// import ChangePasswordPage from '../components/ChangePasswordPage';
export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path="/" component={TrackingPage} exact={true} />
        <PublicRoute path="/login" component={LoginPage} exact={true} />
        <PrivateRoute path="/home" component={HomePage} exact={true} />
        <PrivateRoute path="/orders" component={OrderPage} exact={true} />
        <PrivateRoute path="/orders/edit" component={TrackEditPage} exact={true} />
        <PrivateRoute path="/cutoff" component={CutOffPage} exact={true} />
        <PrivateRoute path="/report" component={ReportPage} exact={true} />
        <PrivateRoute path="/sayhi" component={SayHiPage} exact={true} />
        <PrivateRoute path="/cost" component={CostPage} exact={true} />
        <PrivateRoute path="/votes" component={VotesPage} exact={true} />
        <PrivateRoute path="/manage/teams" component={TeamsPage} exact={true} />
        <PrivateRoute path="/manage/admins" component={AdminsPage} exact={true} />
        <PrivateRoute path="/manage/emails" component={EmailsPage} exact={true} />
        <PrivateRoute path="/manage/email/:uid" component={EmailPage} />
        <PrivateRoute path="/widget/posts" component={PostsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
