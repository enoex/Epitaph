/* =========================================================================
 *
 * game-screen__title.js
 *      Title screen
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';
import Immutable from 'immutable';

import $ from 'jquery';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';

import OnboardingActions from '../actions/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var OnboardingTitle = React.createClass({
    getInitialState: function(){
        return Immutable.Map({});
    },

    // --------------------------------
    // Handle actions
    // --------------------------------
    menuItemClickedNewGame: function() {
        logger.log('onboarding__title:component:menuItemClickedNewGame', 'called');

        // Change state
        OnboardingActions.showNew();
    },

    menuItemClickedResume: function(e) {
        logger.log('onboarding__title:component:menuItemClickedResume', 'called');

        // Change state
        OnboardingActions.showResume();
    },

    // --------------------------------
    // Component handling
    // --------------------------------
    componentDidMount: function(){
        logger.log('components/onboarding__new:componentDidMount', 'called');

        // Trigger animations / transitions based on state
        this.setupPageTurn();

        return this;
    },

    setupPageTurn: function() {
        // TODO: get pages based on state? Re-call flipbook and destroy?
        // TODO: Call flipbook create if it was destroyed?
        // Check previous state?
        logger.log('components/onboarding__title:setupPageTurn', 'called');

        // Setup page turner
        let duration = 600;

        // Page turn needs to be setup here so we can call re-render on the
        // subcomponents (new / title / history) without having to re-setup
        // the page turn
        this.pageTurn = $("#game-screen-onboarding__book--title").turn({
            height: parseInt($('#game-screen-onboarding__book-wrapper--title').height(), 10),
            page: 1,
            disableClickToTurn: false,
            autoCenter: true,
            gradients: true,
            acceleration: true,
            duration: duration,
            elevation: 150,
            when: {
                turning: (event, page, pageObject)=> {
                    logger.log('components/onboarding__title:pageTurn:turning',
                    'turning page: %O', {
                        event: event,
                        targetPage: page,
                        pageObject: pageObject
                    });
                }
            }
        });

        // add the transition class AFTER we've setup the page turn, as if
        // it is added before the margin-left will transition and the book
        // will slide in - we want it started centered
        requestAnimationFrame(()=>{
            $("#game-screen-onboarding__book--title").addClass('transition');
            $("#game-screen-onboarding__book--title").turn("page", 1);
        });
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        logger.log('onboarding__title:component:render', 'called');

        return (
            <div id='game-screen-onboarding__book-wrapper--title'
                className='game-screen-onboarding__book-item-wrapper game-screen__onboarding-wrapper--title'>

                <div id="game-screen-onboarding__book--title" className="game-screen-onboarding__book-item">
                    <div className="hard">
                        <div id='game-screen-title__wrapper'>
                            Title
                            <div id='game-screen-title__menu-wrapper'>

                                <div id='game-screen-title__menu-item--new'
                                    className='game-screen-title__menu-item'
                                    onClick={this.menuItemClickedNewGame}>
                                    New Game
                                </div>

                                <div className='game-screen-title__menu-item'>
                                    Resume
                                </div>

                                <div className='game-screen-title__menu-item'>
                                    Options
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="hard">
                        Credits::::
                    </div>
                </div>
            </div>
        );
    }
});

export default OnboardingTitle;
