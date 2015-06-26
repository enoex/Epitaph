/* =========================================================================
 *
 * game-actions
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';

import React from 'react';
import Reflux from 'reflux';

// Internal Dependencies
// ------------------------------------

// ========================================================================
//
// Functionality
//
// ========================================================================
var GameActions = Reflux.createActions([
    "gameNew",
    "gameResume"
]);
export default GameActions;
