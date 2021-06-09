import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import LoginPage from '../components/LoginPage';
const HomePage = React.lazy(() => import('../components/HomePage'));
const ProfilePage = React.lazy(() => import( '../components/ProfilePage'));
const OrderPage = React.lazy(() => import( '../components/OrderPage'));
const CutOffPage = React.lazy(() => import( '../components/CutOffPage'));
const ReportPage = React.lazy(() => import( '../components/ReportPage'));
import TrackingPage from '../components/TrackingPage';
const TrackEditPage = React.lazy(() => import( '../components/TrackEditPage'));
const SayHiPage = React.lazy(() => import( '../components/admins/SayHiPage'));
const PivotTbPage = React.lazy(() => import( '../components/admins/PivotTbPage'));
const CostPage = React.lazy(() => import( '../components/finances/CostPage'));
const CodPage = React.lazy(() => import( '../components/finances/CodPage'));
const PromotionPage = React.lazy(() => import( '../components/finances/PromotionPage'));
const TopdayPage = React.lazy(() => import( '../components/finances/TopdayPage'));
const VotesPage = React.lazy(() => import( '../components/games/Votes'));
const AdminsPage = React.lazy(() => import( '../components/manage/AdminsPage'));
const ProductTypesPage = React.lazy(() => import( '../components/manage/ProductTypesPage'));
const EmailsPage = React.lazy(() => import( '../components/manage/emails/IndexPage'));
const TeamsPage = React.lazy(() => import( '../components/manage/teams/IndexPage'));
const EmailPage = React.lazy(() => import( '../components/manage/emails/EditPage'));
const TargetsPage = React.lazy(() => import( '../components/manage/targets/TargetsPage'));
const PostsPage = React.lazy(() => import( '../components/widget/PostsPage'));
const SetPostsPage = React.lazy(() => import( '../components/widget/SetPostsPage'));
import NotFoundPage from '../components/NotFoundPage';
const PrivateRoute = React.lazy(() => import( './PrivateRoute'));
const PublicRoute = React.lazy(() => import( './PublicRoute'));
// import ChangePasswordPage from '../components/ChangePasswordPage';
export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={TrackingPage} exact={true} />
          <PublicRoute path="/login" component={LoginPage} exact={true} />
          <PrivateRoute path="/home" component={props => <HomePage {...props} />} exact={true} />
          <PrivateRoute path="/profile" component={props => <ProfilePage {...props} />} exact={true} />
          <PrivateRoute path="/orders" component={props => <OrderPage {...props} />} exact={true} />
          <PrivateRoute path="/orders/edit" component={props => <TrackEditPage {...props} />} exact={true} />
          <PrivateRoute path="/cutoff" component={props => <CutOffPage {...props} />} exact={true} />
          <PrivateRoute path="/report" component={props => <ReportPage {...props} />} exact={true} />
          <PrivateRoute path="/admins/sayhi" component={props => <SayHiPage {...props} />} exact={true} />
          <PrivateRoute path="/admins/pivotTb" component={props => <PivotTbPage {...props} />} exact={true} />
          <PrivateRoute path="/finances/cost" component={props => <CostPage {...props} />} exact={true} />
          <PrivateRoute path="/finances/cod" component={props => <CodPage {...props} />} exact={true} />
          <PrivateRoute path="/finances/promotion" component={props => <PromotionPage {...props} />} exact={true} />
          <PrivateRoute path="/finances/topdays" component={props => <TopdayPage {...props} />} exact={true} />
          <PrivateRoute path="/votes" component={props => <VotesPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/teams" component={props => <TeamsPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/admins" component={props => <AdminsPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/product/types" component={props => <ProductTypesPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/targets" component={props => <TargetsPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/emails" component={props => <EmailsPage {...props} />} exact={true} />
          <PrivateRoute path="/manage/email/:uid" component={props => <EmailPage {...props} />} />
          <PrivateRoute path="/widget/posts" component={props => <PostsPage {...props} />} />
          <PrivateRoute path="/widget/set/posts" component={props => <SetPostsPage {...props} />} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </div>
  </Router>
);

export default AppRouter;
