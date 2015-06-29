/* =========================================================================
 *
 * screen
 *      Actions for which screen the player is on. One of:
 *          'onboarding', 'battle', 'map'
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
var ScreenActions = Reflux.createActions([
    "showOnboarding"
]);
export default ScreenActions;
