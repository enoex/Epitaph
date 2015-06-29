/* =========================================================================
 *
 * Game.js
 *  Main game store
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';
import _ from 'lodash';

import React from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';

// Internal Dependencies
// ------------------------------------
import GameControllerActions from '../actions/game__controller.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// keep track of state

// Store
var GameStore = Reflux.createStore({
    listenables: [GameControllerActions],

    init: function(){
        logger.log('stores/game:store:init', 'called');
    }
});

export default GameStore;
