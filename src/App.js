import React from 'react';
import Start from './components/start/start.component';
import Login from './components/login/login.component';
import Register from './components/register/register.component';
import { Route, Switch } from 'react-router';
import SubscriptionDetails from './components/subscription-details/subscription-details.component';
import SubscriptionList from './components/subscription-list/subscription-list.component';

const App = () => {
  return(
    <Switch>
      <Route path='/' exact component={Start} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/subscriptions/add' component={SubscriptionDetails} />
      <Route path='/subscriptions/edit/:id' component={SubscriptionDetails} />
      <Route path='/subscriptions' component={SubscriptionList} />
    </Switch>
  );
}

export default App;
