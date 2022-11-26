import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/Inbox.module.css';
import InboxMessage from './InboxMessage';

function InboxList() {
	const [messages, setMessages] = useState([1, 2, 3, 4, 5, 6]);

	return (
		<div className="shadow-lg ring-black bg-white py-4 px-4 lg:col-span-3 md:col-span-2 rounded-lg">
			<div className={`${styles.header} w-full p-4 px-0 mb-2 font-bold`}>
				Inbox
			</div>
			{messages.map((message, i) => {
				return <InboxMessage key={i} />;
			})}
		</div>
	);
}

export default InboxList;
