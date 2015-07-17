/* =========================================================================
 *
 * game-screen__new--page2.js
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
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
var Page3 = React.createClass({
    // NOTE: NO state, only use props

    // --------------------------------
    // Utility functions
    // --------------------------------
    getIntroText: function(){
        // TODO: get different text based on past game play
        return `I am old and tired now, but I was not young when the destruction of Felithport began.
        The years since then seem more dim and faded than the years of my youth. Now, I wait.
        Like a gnarled tree, withered and weathered, with nothing to do but decay to the grave.`;
    },

    changeName: function(e){
        let name = e.target.value;
        logger.log('components/onboarding__new--page3:changeName', 'called | name: ' + name);

        OnboardingNewActions.updateData('entity__name', name);
        return this;
    },

    keyDown: function(e){
        // if enter was pressed, go to next page
        if(e.keyCode === 13){
            OnboardingNewActions.pageTurnNext();
        }
    },

    render: function(){
        logger.log('components/onboarding__new--page3:render', 'called %O', this.props);

        return (
            <div>
                <div className='onboarding-new__page-1__intro-text'>
                    {this.getIntroText()}
                </div>
                <div className='onboarding-new__page-1__name-warpper'>
                    I was infamous; most people knew me as
                    <input type='text'
                        name="page1-name-input"
                        key="page1nameInput"
                        className='interaction__input'
                        onChange={this.changeName}
                        onKeyDown={this.keyDown}
                        value={this.props.name || ''}
                        placeholder={this.props.name || 'Your Name'}
                        ></input>
                </div>
            </div>
        );
    }
});

export default Page3;
