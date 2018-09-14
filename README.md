# Finesse Inactivity Gadget

There is missing functionality in CCX to logout an agent that has been Idle for an extended period of time.

This project provides sample code for a Finesse gadget that provides this functionality in CCX only. 

This gadget and code is to be used with [Cisco Finesse](http://developer.cisco.com/site/finesse), a next-generation agent desktop.

The URL used is: [3rdpartygadget/files/inactivity/Inactivity.xml?timeout=15](3rdpartygadget/files/inactivity/Inactivity.xml?timeout=15)

* Inactivity.xml is the gadget XML file
* timeout=15 is the timeout value in seconds, it can be changed to the desired timeout period.

Note:

* The gadget will show a counter in seconds of how long the agent has been idle in **NOT READY** state. 
* Keeping the behaviour similar to CCE we are not sending logout in any other state apart from Not Ready. 
* Every state change from **NOT READY** to another state will reset the counter. 
* Agent will not go logout in **READY/RESERVE/TALKING** state.
* Hovering the mouse over the gadget will also reset the timer in **NOT READY** state.

## Additional Info

#### Finesse REST API
Documentation for the Finesse REST API can be found in the [Finesse Developer Guide](https://developer.cisco.com/docs/finesse/#!rest-api-dev-guide).

##### Finesse JavaScript Library
Documentation for the Finesse JavaScript library can be found on [DevNet](https://developer.cisco.com/docs/finesse/#!javascript-library).
