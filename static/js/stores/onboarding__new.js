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

// errors by furthest page
var FURTHEST_ERRORS = {
    '3': 'What should we call you?',
    '4': 'What should we call you?'
};

// STORE
var OnboardingNewStore = Reflux.createStore({
    listenables: [OnboardingActions, OnboardingNewActions],

    init: function(){
        logger.log('onboarding__new:store:init', 'called');
        // set initial data
        this.data = Immutable.fromJS({
            // page info
            // default is page 3 (which is the first step of the new character
            // flow)
            page: 3,
            furthestPageEnabled: 3,
            // error if user tries to go to next page
            furthestError: FURTHEST_ERRORS['3'],

            // entity info
            entity__name: '',

            // page states
            page3__fadeInIntroText: true
        });

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
    // Util to get character data from create state
    // --------------------------------
    getEntityFromBookState: function (){
        return {};
    },

    // --------------------------------
    // Update data
    // --------------------------------
    onUpdateData: function( key, value ){
        // Takes in a key and value then updates and returns the new data
        logger.log('stores/onboarding__new:updateData', 'called with ' + key + ', ' + value);

        var furthest = this.data.get('furthestPageEnabled');
        var furthestError = this.data.get('furthestError');

        // TODO: clean way to do this...
        if(key === 'entity__name'){
            // no value? We can't go on
            if(('' + value).length < 1){
                furthest = 3;
                furthestError = FURTHEST_ERRORS['3'];

            } else if (furthest === 3){
                furthest = 4;
                furthestError = FURTHEST_ERRORS['4'];
            }
        }

        // update data
        this.data = this.data.mergeDeep({
            [key]: value,
            furthestPageEnabled: furthest,
            furthestError: furthestError
        });

        this.trigger({ data: this.data });
        return this;
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
