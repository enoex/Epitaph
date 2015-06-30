/* =========================================================================
 *
 * onboarding__new
 *      Actions for the create character flow
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
var OnboardingNewActions = Reflux.createActions([
    'pageTurnNext',
    'pageTurnPrevious',
    'updateData'
]);
export default OnboardingNewActions;
