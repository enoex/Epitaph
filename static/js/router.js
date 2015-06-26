/* =========================================================================
 *
 * router.js
 *  Routes / router for app
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import {create, HistoryLocation} from 'react-router';

// Internal Dependencies
// ------------------------------------
// Component imports
import Main from './components/main.js';
import GameMain from './components/game__main.js';
import NotFound from './components/not-found.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// NOTE: For node-webkit, we need a route that matches /index.html
var routes = (
    <Route handler={Main} >
        <Route name="game" path="/" handler={GameMain}> </Route>
        <Route path="/index.html" handler={GameMain}> </Route>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);

//export default create({ routes, HistoryLocation });
export default create({
    routes: routes,
    location: HistoryLocation
});
