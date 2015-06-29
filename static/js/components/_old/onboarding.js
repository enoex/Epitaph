/* =========================================================================
 *
 * game-screen__onboarding.js
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
import OnboardingStore from '../stores/onboarding.js';
import OnboardingNewStore from '../stores/onboarding__new.js';

// TODO: How to disable page turn when click on corners?
window.a = OnboardingActions;

// Book Pages
import ScreenTitle from './onboarding__title.js';
import ScreenNew from './onboarding__new.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('GameMain');

var ScreenOnboarding = React.createClass({
    mixins: [
        Reflux.listenTo(OnboardingStore, 'onboardingStoreChange')
    ],

    getInitialState: function(){
        this._previousPage = 1;
        this._previousBookState = 'title';

        return {
            state: Immutable.Map({
                bookState: 'title',
                page: this._previousPage
            })
        };
    },

    // STORE Changes
    // --------------------------------
    onboardingStoreChange: function(message){
        // Change state if necessary
        // NOTE: We can't use props because we do NOT want to trigger an entire
        // re-render
        logger.log('components/onboarding:storeChange', 'called | %O', message);

        if(!Immutable.is(message.data, this.state.state)){
            // Book state is different, re-render everything
            logger.log('components/onboarding:storeChange:dataDiff', 'data not same, changing');

            this.setState({ state: message.data });
        }
        return this;
    },

    // Component Mounting
    // --------------------------------
    componentWillMount: function(){
        logger.log('components/onboarding:componentWillMount', 'called');
        timings.push('componentWillMount');
    },

    shouldComponentUpdate: function(nextProps, nextState){
        logger.log('components/onboarding:shouldComponentUpdate', 'checking | %O', arguments);

        // Only update (render) if the book state is different
        if(nextState.state.get('bookState') !== this.state.state.get('bookState')){
            logger.log('components/onboarding:shouldComponentUpdate', 'true');
            return true;

        } else {
            // Check if we should turn the page (requires bookState to be same)
            if(nextState.state.get('page') !== this.state.state.get('page')){
                logger.log('components/onboarding:shouldComponentUpdate', 'turning page');
                this.pageTurn.turn('page', nextState.state.get('page'));
            }

            logger.log('components/onboarding:shouldComponentUpdate', 'false');
            return false;
        }
    },

    componentDidUpdate: function(){
        logger.log('components/onboarding:componentDidUpdate', 'called %O', {
            state: this.state,
            previousPage: this._previousPage,
            previousBookState: this._previousBookState
        });

        // If page state is different, we do need to re-setup page turn
        if(this._previousBookState !== this.state.state.get('bookState')){
            logger.log('components/onboarding:componentDidUpdate:differentBookState',
            'preparing to setup page turn for a different book state | ' +
            '<' + this.state.state.get('bookState') + '>');

            this.setupPageTurn();
        }

        // Update previous states
        this._previousPage = this.state.state.get('page');
        this._previousBookState = this.state.state.get('bookState');
    },

    componentDidMount: function(){
        // After render is called, setup the flipbook
        timings.push('componentDidMount');
        logger.log('components/onboarding:componentDidMount',
        '<finished> called | took: ' + timings.printLast());

        this.setupPageTurn();
    },


    // Setup page turn
    // --------------------------------
    setupPageTurn: function() {
        // TODO: get pages based on state? Re-call flipbook and destroy?
        // TODO: Call flipbook create if it was destroyed?
        // Check previous state?
        logger.log('components/onboarding:setupPageTurn', 'called');

        // Setup page turner
        let duration = 600;

        // Page turn needs to be setup here so we can call re-render on the
        // subcomponents (new / title / history) without having to re-setup
        // the page turn
        this.pageTurn = $("#game-screen-onboarding__book").turn({
            height: parseInt($('#game-screen-onboarding__book-wrapper').height(), 10),
            page: 1,
            disableClickToTurn: this.state.state.get('bookState') === 'title' ? false : true,
            autoCenter: true,
            gradients: true,
            acceleration: true,
            duration: duration,
            elevation: 150,
            when: {
                turning: (event, page, pageObject)=> {
                    logger.log('components/onboarding:pageTurn:turning',
                    'turning page: %O', {
                        event: event,
                        targetPage: page,
                        bookState: this.state.state.get('bookState'),
                        pageObject: pageObject
                    });

                    // turn page to new page
                    OnboardingActions.turnPage({
                        targetPage: page,
                        pageObject: pageObject,
                        event: event,
                        bookState: this.state.state.get('bookState')
                    });

                    // TODO: Trigger actions that other components listen to

                    // When going BACK to page 1 (from any book state),
                    // trigger the gameTitle action to update the state so the
                    // book and component will rerender
                    if(page === 1){
                        let retriggerStateDuration = 190;
                        setTimeout(()=>{requestAnimationFrame(()=>{
                            // Change state
                            OnboardingActions.showTitle();

                        }); }, retriggerStateDuration);
                    }

                    // If we're on the title screen, don't show page 2
                    if( page === 2 &&
                    this.state.state.get('bookState') === 'title'){
                        // Do not go to the "back" of the book
                        // TODO: Or, maybe we should? Might be cool if the
                        // back of the book had information about the game
                        // like credits....
                        return false;
                    }
                }
            }
        });

        // Disable page turn animation
        this.pageTurn.bind('start', function (event, pageObject, corner){
            if (corner === 'tl' || corner === 'tr' ||
            corner === 'bl' || corner === 'br'){
                return event.preventDefault();
            }
        });

        // add the transition class AFTER we've setup the page turn, as if
        // it is added before the margin-left will transition and the book
        // will slide in - we want it started centered
        requestAnimationFrame(()=>{
            $("#game-screen-onboarding__book").addClass('transition');
            $("#game-screen-onboarding__book").turn("page", this.state.state.get('page'));
        });
    },

    // Render
    // --------------------------------
    render: function(){
        logger.log('components/onboarding:render',
        'called | previousState: ' + this._previousBookState + ' | current: ' +
        this.state.state.get('bookState'));

        // Setup pages based on bookState (title, create, resume, or options page)
        var bookHtml;
        if(this.state.state.get('bookState') === 'title'){
            // TITLE PAGE
            bookHtml = ( <ScreenTitle /> );

        } else if (this.state.state.get('bookState') === 'new'){
            // CREATE NEW CHARACTER
            bookHtml = ( <ScreenNew /> );

        } else {
            logger.log('error:components/onboarding:render', 'invalid book state', this.state.state.get('bookState'));
            bookHtml = ( <div> INVALID STATE </div> );
        }

        return (
            <div id='game-screen__onboarding-wrapper'>
                <div id='game-screen-onboarding__book-wrapper'>
                    {bookHtml}
                </div>
            </div>
        );
    }
});

export default ScreenOnboarding;
