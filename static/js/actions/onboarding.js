/* =========================================================================
 *
 * onboarding
 *      Onboarding screen actions
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
var OnboardingActions = Reflux.createActions([
    "showTitle",
    "showNew",
    "showResume",

    "turnPage"
]);
export default OnboardingActions;
