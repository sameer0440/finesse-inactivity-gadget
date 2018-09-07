Finesse Inactivity Gadget:

There is a missing functionality in CCX to “Logout the agent being Idle for long time”

This gadget is written to provide that functionality in CCX only

The URL being used is

3rdpartygadget/files/inactivity/Inactivity.xml?timeout=15

Inactivity.xml is the gadget XML file

timeout=15 is the timeout value given which can be changed to any value ,this value will counted in seconds .

Note :

¬	The gadget will show the counter in seconds that how long the agent has been idle in “NOT READY” state. 
¬ Keeping the behaviour similar to CCE we are not sending logout in any other state apart from Not Ready. 
¬	Every state change from Not Ready to other state will reset counter. 
¬	Agent will not go logout in READY/RESERVE/TALKING state. 
¬ Hovering the mouse over the gadget will also reset the timer in Not Ready state.
