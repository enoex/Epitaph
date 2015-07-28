/* =========================================================================
 *
 * errors
 *      Error actions
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
var Errors = Reflux.createActions([
    "triggerError"
]);
export default Errors;
