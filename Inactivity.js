// author Sameer Kumar <sameyada@cisco.com >
var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {}; // for logging

finesse.modules = finesse.modules || {};
finesse.modules.Inactivity = (function($) {


    var user, states, currentTime, currentState, dialogs, dialogValue, clientlogs,
        _lastProcessedTimerTick = null,

        //Gadget defined field: _maxTimerCallbackThreshold
        _maxTimerCallbackThreshold = 500,

        //Gadget defined field: _forceTickProcessingEvery (10 seconds)
        _forceTickProcessingEvery = 1000;

    //taking timeout value from URL in seconds

    var timeout = location.search.substring(window.location.search.indexOf("timeout%3D") + 10);

    var IDLE_TIMEOUT = timeout; // In seconds
    var _idleSecondsCounter = 1;

    //Gesture code
    document.onclick = function() {
        _idleSecondsCounter = 0;
    };
    document.onmousemove = function() {
        _idleSecondsCounter = 0;
    };



    /**
     * Processes a timer tick - updating the UI.
     * @param start is the time that the tick was received
     * @returns {boolean} true
     */
    _processTick = function(start) {

            _lastProcessedTimerTick = start;
            _CheckIdleTime();
            return true;
        },

        /**
         * Timer tick callback handler.
         * @param data
         */
        _timerTickHandler = function(timerTickEvent) {
            var start, end, diff, discardThreshold, processed;

            start = (new Date()).getTime();
            processed = false;

            //Prevent starvation of timer logic
            if (_lastProcessedTimerTick === null) {
                processed = _processTick(start);
            } else {
                if ((_lastProcessedTimerTick + _forceTickProcessingEvery) <= start) {
                    //Force processing at least every _forceTickProcessingEvery milliseconds
                    processed = _processTick(start);
                }

                end = (new Date()).getTime();
                diff = end - start;
                if (diff > _maxTimerCallbackThreshold) {
                    _clientLogs.log("Inactivity Gadget took too long to process timer tick (_maxTimerCallbackThreshold exceeded).");
                }
            }
        },

        //Function to keep checking idle time

        _CheckIdleTime = function CheckIdleTime() {

            //logout the user when idle time is equal to timeout value state in not ready and there is no dialog

            if ((_idleSecondsCounter >= IDLE_TIMEOUT) && (currentState == 'NOT_READY') && (dialogValue == null)) {
                clientLogs.log("Performing agent logout due to inactivity");
                user.setState(states.LOGOUT);

            }

            if ((_idleSecondsCounter <= IDLE_TIMEOUT) && (currentState == 'NOT_READY') && (dialogValue == null)) {
                $("#timer").text(IDLE_TIMEOUT - _idleSecondsCounter);

            }

            _idleSecondsCounter++;

        },




        _resetTimer = function resetTimer() {
            _idleSecondsCounter = 0;
            $("#timer").text("");

        },


        render = function() {
            //In case of state change reset the timer
            _resetTimer();
            currentState = user.getState();
            gadgets.window.adjustHeight();



        },

        renderLoad = function() {
            currentState = user.getState();
        },


        handleNewDialog = function(dialog) {
            dialogValue = dialog.getState();
            resetTimer();

        },

        handleEndDialog = function(dialog) {
            dialogValue = null;
            resetTimer();
        },



        handleUserLoad = function(userevent) {
            renderLoad();
            dialogs = user.getDialogs({
                onCollectionAdd: handleNewDialog,
                onCollectionDelete: handleEndDialog
            });
        };



    handleUserChange = function(userevent) {
        render();
    };

    return {


        init: function() {
            var cfg = finesse.gadget.Config;
            _resetTimer();

            clientLogs = finesse.cslogger.ClientLogger;
            finesse.clientservices.ClientServices.init(cfg, false);

            clientLogs.init(gadgets.Hub, "Inactivity");

            user = new finesse.restservices.User({
                id: cfg.id,
                onLoad: handleUserLoad,
                onChange: handleUserChange
            });

            states = finesse.restservices.User.States;
            containerServices = finesse.containerservices.ContainerServices.init();
            finesse.containerservices.ContainerServices.addHandler(finesse.containerservices.ContainerServices.Topics.TIMER_TICK_EVENT, _timerTickHandler);

            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, function() {
                clientLogs.log("Gadget is now visible");
                gadgets.window.adjustHeight();
            });
            containerServices.makeActiveTabReq();
        }
    };
}(jQuery));
