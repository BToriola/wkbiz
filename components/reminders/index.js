import React, { useState } from "react";
import ReminderList from "../../components/reminders/ReminderList";
import HeaderMenuReminder from "../../components/headerMenuReminder";

function Reminders() {
  // const [reminders] = useState("");
 
  return (
    <> 
      <div className="h-full overflow-hidden">
        <HeaderMenuReminder />
        <ReminderList  />
      </div>
    </>
  );
}

export default Reminders;
