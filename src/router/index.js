import React from 'react';
import {
    Switch, Route,
} from 'react-router-dom';

import PageBuilder from './PageBuilder';
import HomePage from './Home';
import Login from './Login';
import Events from './Events';
import Articles from './Articles';
import Browse from './Browse';
import Content from './Content';
import Profile from './Profile';
import Animations from './Animations';
import Campuses from './Campuses';

const Router = () => (
    <Switch>
        <Route exact path="/animations" component={Animations} />

        <Route path="/login" component={Login} />
        <Route path="/events" component={Events} />
        <Route path="/content" component={Content} />
        <Route path="/articles" component={Articles} />
        <Route path="/browse" component={Browse} />
        <Route path="/profile" component={Profile} />
        <Route path="/locations" component={Campuses} />

        <Route exact path="/:page" component={PageBuilder} />

        <Route path="*" component={HomePage} />
    </Switch>
);

export default Router;
