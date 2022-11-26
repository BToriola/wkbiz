import React, {useState} from 'react';
import DataCard from '../DataCard';
import NotesList from '../NotesList'; 
import Card from '../tasks/Card';
import ReminderJSON from "../../utils/reminders.json";
import ReminderCard from "../../components/reminders/ReminderCard" 
function Inbox({selectedUser}) {
	return (
		<div className="lg:col-span-4 md:col-span-2 rounded-lg h-full">
			<DataCard user={selectedUser}/>
			 <NotesList customer={selectedUser}/> 
			{/* <ReminderCard reminder={ReminderJSON[0]}/>
			<Card task={task} color={color}/> */}
		</div>
	);
}

export default Inbox;
