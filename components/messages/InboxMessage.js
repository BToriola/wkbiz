import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/Inbox.module.css';

const InboxMessage = ({ data }) => {
	return (
		<div className={`flex py-2 px-4 ${styles['customer-card']}`}>
			<div className="mt-1">
				<Image
					alt="logo"
					width={40}
					height={40}
					className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
					src="https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"
				/>
			</div>

			<div className="pl-4 relative w-full">
				<p className="font-normal text-xs">Bolaji Dauda</p>
				<p className="font-thin text-xs">It is Biddy</p>
				<p className="font-bold text-red-500 text-xs">
					Website subscription expired
				</p>
				<div className="absolute top-0 right-0">
					<p className="font-thin text-xs">1 Hour ago</p>
				</div>
			</div>
		</div>
	);
};

export default InboxMessage;
