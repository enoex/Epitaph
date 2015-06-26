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

import GameStore from '../stores/Game.js';
import GameActions from '../actions/game-actions.js';

// Book Pages
import GameScreenTitle from './game-screen__onboarding--title.js';
import GameScreenCreate from './game-screen__onboarding--create.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('GameMain');

var ScreenOnboarding = React.createClass({
    mixins: [Reflux.listenTo(GameStore, 'storeChange')],

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

    storeChange: function(message){
        // Change state if necessary
        // NOTE: We can't use props because we do NOT want to trigger an entire
        // re-render
        logger.log('ScreenTitle:component:storeChange', 'called | %O', message);

        if(!Immutable.is(message.data.get('screenState'), this.state.state)){
            this.setState({
                state: message.data.get('screenState')
            });
        }

        return this;
    },

    // Component Mounting
    // --------------------------------
    componentWillMount: function(){
        timings.push('componentWillMount');
    },

    componentDidMount: function(){
        // After render is called, setup the flipbook
        timings.push('componentDidMount');
        logger.log('ScreenTitle:component:componentDidMount',
        '<finished> called | took: ' + timings.printLast());

        this.setupPageTurn(false);
    },

    componentDidUpdate: function(){
        logger.log('ScreenTitle:component:componentDidUpdate', 'called %O', {
            state: this.state,
            previousPage: this._previousPage,
            previousBookState: this._previousBookState
        });

        // If page state is different, we do need to re-setup page turn
        if(this._previousBookState !== this.state.state.get('bookState')){
            this.setupPageTurn(true);
        }

        // Update previous states
        this._previousPage = this.state.state.get('page');
        this._previousBookState = this.state.state.get('bookState');
    },

    // Setup page turn
    // --------------------------------
    setupPageTurn: function(shouldDestroy) {
        // TODO: get pages based on state? Re-call flipbook and destroy?
        // TODO: Call flipbook create if it was destroyed?
        // Check previous state?
        logger.log('ScreenTitle:component:setupPageTurn', 'called');

        requestAnimationFrame(()=>{
            // Setup page turner
            let duration = 600;

            $("#game-screen-onboarding__book").turn({
                height: parseInt($('#game-screen-onboarding__book-wrapper').height(), 10),
                page: 1,
                autoCenter: true,
                gradients: true,
                acceleration: true,
                duration: duration,
                elevation: 150,
                when: {
                    turning: (event, page, pageObject)=> {
                        // TODO: XXXXXXXXXXXXXX
                        // Figure out how best to handle going back to page 1.
                        // Should the create flow just only exist for the book?
                        // If you click options or achievements, maybe a different
                        // UI element should come in
                        if(page === 1){
                        }
                    }
                }
            });

            // add the transition class AFTER we've setup the page turn, as if
            // it is added before the margin-left will transition and the book
            // will slide in - we want it started centered
            requestAnimationFrame(()=>{
                $("#game-screen-onboarding__book").addClass('transition');
                $("#game-screen-onboarding__book").turn("page", this.state.state.get('page'));
            });
        });
    },

    // Render
    // --------------------------------
    render: function(){
        logger.log('ScreenOnboarding:component:render',
        'called | previousState: ' + this._previousBookState + ' | current: ' +
        this.state.state.get('bookState'));

        window.z = this;

        // Setup pages based on bookState (title, create, resume, or options page)
        var bookHtml;
        if(this.state.state.get('bookState') === 'title'){
            // TITLE PAGE
            bookHtml = ( <GameScreenTitle />);

        } else if (this.state.state.get('bookState') === 'create'){
            // CREATE NEW CHARACTER
            bookHtml = ( <GameScreenCreate />);
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
