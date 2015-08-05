/* =========================================================================
 *
 * Onboarding New
 *      Store for new user creation flow
 *
 *      TODO: Rename this.state to this.state ?
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
import ErrorActions from '../actions/errors.js';

import saveDataOnChangeForKey from './util/save-data-on-change-for-key.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// ====================================
//
// Utility values
//
// ====================================
var MAX_NUM_PAGES = 8;

// errors by furthest page
var FURTHEST_ERRORS = {
    '3': 'What should we call you?',
    '4': 'What were you raised as?',
    '5': 'What were you proficient in?'
};

var STORE_KEY = 'store:onboarding__new';

// TODO: Pull from server
import AVAILABLE_RACES from './data/races.js';
import AVAILABLE_ABILITIES from './data/abilities.js';

// ====================================
//
// STORE
//
// ====================================
var OnboardingNewStore = Reflux.createStore({
    listenables: [OnboardingActions, OnboardingNewActions],

    init: function(){
        logger.log('onboarding__new:store:init', 'called');

        // listen for changes and update
        saveDataOnChangeForKey(this, STORE_KEY);

        // set initial data
        this.state = Immutable.fromJS({
            // page info
            // default is page 3 (which is the first step of the new character
            // flow)
            page: 3,
            furthestPageEnabled: 3,
            // error if user tries to go to next page
            furthestError: FURTHEST_ERRORS['3'],

            data__races: AVAILABLE_RACES,
            data__abilities: AVAILABLE_ABILITIES,

            // entity info
            entity__name: '',
            entity__race: {},
            entity__abilities: [],

            // page states
            page3__fadeInIntroText: true
        });

        return this;
    },

    // load initial data
    // --------------------------------
    loadInitialState: function(){
        // loads initial state when called (from onboarding store)
        window.localforage.getItem(STORE_KEY, (err, d)=>{
            requestAnimationFrame(()=>{
                if(!d || !JSON.parse(d)){
                    logger.log('warn:stores/onboarding__new:loadInitialState',
                    'no data ' + d);
                    return false;
                }

                // setup initial data
                var dataParsed;
                dataParsed = JSON.parse(d);

                logger.log('stores/onboarding__new:loadInitialState', 'called | %O', {
                    data: dataParsed
                });

                // Check that localForage data is not out of date
                // TODO: XXXXXXXXXXXXXX
                // Handle this in a better way - how do we specify which
                // keys should exist? What if client loads game with old
                // local forage data?
                // TODO: Check version. If version mismatch, clear localforage?
                if(!dataParsed.data__races || !dataParsed.data__races){
                    return false;
                }

                setTimeout(()=>{requestAnimationFrame(()=>{
                    this.state = Immutable.fromJS(dataParsed);
                    this.trigger({ state: this.state });
                }); }, 120);
            });
        });
    },

    // State manipulation
    // --------------------------------
    getState: function(){
        logger.log('stores/onboarding__new:getState', 'called');
        // utility to return state
        return this.state;
    },

    setState: function(state, triggerChange){
        logger.log('stores/onboarding__new:setState', 'called');
        // utility function to manually set state. Useful when fetching state
        // from parent and propagating state downwards to this store
        this.state = state;
        if(triggerChange){ this.trigger({ state: this.state }); }

        return this.state;
    },

    // Util to get character data from create state
    // --------------------------------
    getEntityFromBookState: function (){
        return {};
    },

    // --------------------------------
    //
    // Update state
    //
    // --------------------------------
    onUpdateData: function( key, value ){
        // Takes in a key and value then updates and returns the new state
        logger.log('stores/onboarding__new:updateData', 'called with ' + key + ', ' + value);

        var furthest = this.state.get('furthestPageEnabled');
        var furthestError = this.state.get('furthestError');

        // TODO: clean way to do this...
        // Need to check if certain keys exist to set furthest page
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
        this.state = this.state.mergeDeep({
            [key]: value,
            furthestPageEnabled: furthest,
            furthestError: furthestError
        });

        this.trigger({ state: this.state });
        return this;
    },

    // --------------------------------
    // Update data utils
    // --------------------------------
    onSelectRace: function( raceName ){
        // Takes in a race's name and sets the selected race object to be
        // the corresponding race
        logger.log('stores/onboarding__new:onSelectRace', 'called with ' + raceName);
        var selectedRace;

        for(let i = 0; i < AVAILABLE_RACES.length; i++){
            if(AVAILABLE_RACES[i].name === raceName){
                selectedRace = AVAILABLE_RACES[i];
                break;
            }
        }

        if(selectedRace){
            // Set the selected race
            this.state = this.state.mergeDeep({
                entity__race: selectedRace
            });

            this.trigger({ state: this.state });

        } else {
            // No selected race found
            logger.log('error:stores/onboarding__new:onSelectRace',
            'could not find race');

            ErrorActions.triggerError({
                message: "Could not find race",
                internal: true
            });
            return false;
        }
    },

    // --------------------------------
    //
    // Turn page
    //
    // --------------------------------
    onPageTurnNext: function(){
        logger.log('stores/onboarding__new:onPageTurnNext', 'called');

        // check that we can't go furthest than the current furthest progress page
        if(this.state.get('furthestPageEnabled') <= this.state.get('page')){
            logger.log('warn:stores/onboarding__new:onPageTurnNext',
           'cannot continue. current page: ' + this.state.get('page') +
            ' | furthest enabled: ' + this.state.get('furthestPageEnabled'));

            // TODO: Throw error; have view listen for and catch it
            // TODO: onboarding error store
            window.alert(this.state.get('furthestError'));
            return false;
        }

        // check that we can't go past the very end
        if(this.state.get('page') + 2 > MAX_NUM_PAGES){
            logger.log('warn:stores/onboarding__new:onPageTurnNext', 'max pages exceeded');
            return false;
        }

        this.state = this.state.mergeDeep({page: this.state.get('page') + 2});
        this.trigger({ state: this.state });
    },

    onPageTurnPrevious: function(){
        logger.log('stores/onboarding__new:onPageTurnPrevious', 'called');

        if(this.state.get('page') < 4){
            logger.log('warn:stores/onboarding__new:onPageTurnPrevious', 'min pages exceeded');
            return false;
        }

        this.state = this.state.mergeDeep({page: this.state.get('page') - 2});
        this.trigger({ state: this.state });
    }

});

export default OnboardingNewStore;
