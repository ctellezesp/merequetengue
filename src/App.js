import React from 'react';
import Start from './components/start/start.component';
import Login from './components/login/login.component';
import Register from './components/register/register.component';
import { Route, Switch } from 'react-router';
import SubscriptionDetails from './components/subscription-details/subscription-details.component';
import SubscriptionList from './components/subscription-list/subscription-list.component';
import RecoverPassword from './components/recover-password/recover-password.component';
import UserSubscriptionsDetails from './components/user-subscription-details/user-subscription-details.component';
import UserSubscriptionsList from './components/user-subscription-list/user-subscription-list.component';

const App = () => {
  return (
    <Switch>
      <Route path='/' exact component={Start} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/recover-password' component={RecoverPassword} />
      <Route path='/subscriptions/add' component={SubscriptionDetails} />
      <Route path='/subscriptions/edit/:id' component={SubscriptionDetails} />
      <Route path='/subscriptions' component={SubscriptionList} />
      <Route path='/user/subscriptions/add' component={UserSubscriptionsDetails} />
      <Route path='/user/subscriptions/edit/:id' component={UserSubscriptionsDetails} />
      <Route path='/user/subscriptions/list' component={UserSubscriptionsList} />
    </Switch>
  );
}

export default App;
