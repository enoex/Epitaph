/* =========================================================================
 *
 * game-screen__new--page4.js
 *      Race selection
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react/addons';
let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';
import Immutable from 'immutable';
import classNames from 'classnames';

import $ from 'jquery';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';

import events from '../events.js';

import OnboardingNewStore from '../stores/onboarding__new.js';

import OnboardingNewActions from '../actions/onboarding__new.js';
import OnboardingActions from '../actions/onboarding.js';
import OnboardingStore from '../stores/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var Page4 = React.createClass({

    selectRace: function(race){
        logger.log('components/onboarding__new--page4:selectRace', 'called | %j', race);
        OnboardingNewActions.selectRace(race.name);
        return this;
    },

    render: function(){
        logger.log('components/onboarding__new--page4:render', 'called %O', this.props);

        // convert from immutableJs
        let races = [];
        if(this.props.availableRaces){ races = this.props.availableRaces.toJS(); }

        let selectedRace = (this.props.selectedRace ? this.props.selectedRace.toJS() : null);

        let racesHtml = races.map(( race, i )=>{
            let isSelected = false;
            if(selectedRace){ isSelected = (race.name === selectedRace.name); }

            // CSS classes
            let classes = classNames({
                'interaction__select-item': true,
                'interaction__select-item--selected': isSelected,
                'onboarding-new-page-4__race-list-item': true
            });

            return (
                <div key={race.name}
                    className={classes}
                    onClick={this.selectRace.bind(this, race)}
                    >
                    <div className='interaction__select-item-inner'>
                        {race.name}
                    </div>
                </div>
            );
        });

        // Setup final HTML
        return (
            <div>
                <h3> Race </h3>
                <div className='interaction__select-list-wrapper'>
                    {racesHtml}
                </div>
            </div>
        );
    }
});

export default Page4;
