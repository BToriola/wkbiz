import React, { useEffect, useState } from 'react';
import CustomerDetails from './CustomerDetails';
import NotesList from '../NotesList';
const CustomerPanel = ({ selectedUser, communityID, user }) => {
	const [customer, setCustomer] = useState();
	const [_communityID, setCommunityID] = useState();
	useEffect(() => {
		setCustomer(selectedUser);
		setCommunityID(communityID);
	}, [selectedUser]);
	return (
		<div
			className="lg:col-span-4 md:col-span-2 rounded-lg "
			style={{ height: 500 }}
		>
			<CustomerDetails customer={customer} />
			<NotesList customer={customer} communityID={_communityID} user={user} />
		</div>
	);
};

export default CustomerPanel;
