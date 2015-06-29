/* =========================================================================
 *
 * Onboarding New
 *      Store for new user creation flow
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
import OnboardingNewActions from '../actions/onboarding__new.js';
import OnboardingActions from '../actions/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// Utility values
var MAX_NUM_PAGES = 8;

// STORE
var OnboardingNewStore = Reflux.createStore({
    listenables: [OnboardingActions, OnboardingNewActions],

    init: function(){
        logger.log('onboarding__new:store:init', 'called');
        // set initial data
        this.data = Immutable.fromJS({ page: 2 });

        return this;
    },

    getData: function(){
        logger.log('stores/onboarding__new:getData', 'called');
        // utility to return data
        return this.data;
    },

    setData: function(data, triggerChange){
        logger.log('stores/onboarding__new:setData', 'called');
        // utility function to manually set data. Useful when fetching data
        // from parent and propagating data downwards to this store
        this.data = data;
        if(triggerChange){ this.trigger({ data: this.data }); }

        return this.data;
    },

    // --------------------------------
    //
    // Turn page
    //
    // --------------------------------
    onPageTurnNext: function(){
        logger.log('stores/onboarding__new:onPageTurnNext', 'called');

        if(this.data.get('page') + 2 > MAX_NUM_PAGES){
            logger.log('warn:stores/onboarding__new:onPageTurnNext', 'max pages exceeded');
            return false;
        }

        this.data = this.data.mergeDeep({page: this.data.get('page') + 2});
        this.trigger({ data: this.data });
    },
    onPageTurnPrevious: function(){
        logger.log('stores/onboarding__new:onPageTurnPrevious', 'called');

        if(this.data.get('page') < 3){
            logger.log('warn:stores/onboarding__new:onPageTurnPrevious', 'min pages exceeded');
            return false;
        }

        this.data = this.data.mergeDeep({page: this.data.get('page') - 2});
        this.trigger({ data: this.data });
    }

});

export default OnboardingNewStore;
