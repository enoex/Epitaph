/* =========================================================================
 *
 * Game Controller
 *      Actions for the main, game wide game controller
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';

import React from 'react';
import Reflux from 'reflux';

// ========================================================================
//
// Functionality
//
// ========================================================================
var GameControllerActions = Reflux.createActions([
    "showOnboarding"
]);
export default GameControllerActions;
