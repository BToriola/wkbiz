import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import Image from 'next/image';
import styles from '../../styles/Inbox.module.css';
import Moment from 'react-moment';
import { stampToDate } from '../../utils/timehelper';

const CustomerCard = ({
	customer,
	selectedUser,
	isSelected/*
	manager,
	searchTerm,
	managerFilters,
	roleFilters,
	membershipFilters, */
}) => {
	const { state, dispatch } = useContext(Context);
	const { pictureURL, name, businessName, type } = customer;
	const [selected, setSelected] = useState();
	const [roles, setRoles] = useState();
	const [myRoles, setMyRoles] = useState([]);

	// const updateContext = () => {
	// 	dispatch({
	// 		type: 'SELECTED_CUSTOMER',
	// 		payload: selected,
	// 	});
	// };
	const TYPE_COLORS = {
		"LEAD": "#90be16",
		"CUSTOMER": "#4DC5E2",
		"EVANGELIST": "#00A85A"
	}
	useEffect(() => {
		// updateContext();
		selectedUser(customer);
	}, [selected]);

	/* 
		useEffect(() => {
			if (state?.roles && customer) { 
				if (!customer?.profileID) return; 
				setMyRoles(state.roles?.roles[customer?.profileID] || []);
			}
		}, [state]);
		let visible = true;
		const t = searchTerm.toLowerCase();
		if (
			t &&
			!customer.name?.toLowerCase?.()?.includes?.(t) &&
			!customer.businessName?.toLowerCase?.()?.includes?.(t)
		) {
			visible = false;
			myRoles?.forEach((role) => {
				if (role.toLowerCase().includes(t)) visible = true;
			});
		}
		if (managerFilters?.length > 0) {
			if (!managerFilters.includes(manager?.profileID || '-')) visible = false;
		}
		if (membershipFilters?.length > 0) {
			if (customer.profileID && !membershipFilters.includes('Joined Wakanda'))
				visible = false;
			if (!customer.profileID) {
				if (
					customer.timeLeftWakanda &&
					!membershipFilters.includes('Left Community')
				)
					visible = false;
				if (
					!customer.timeLeftWakanda &&
					!membershipFilters.includes('Not yet on Wakanda')
				)
					visible = false;
			}
		}
		if (roleFilters?.length > 0) {
			if (myRoles?.filter((r) => roleFilters.includes(r)).length == 0)
				visible = false;
		}
		if (!visible) return <div></div>;
		 */
	return (
		<button
			className={`flex py-2 sm:px-2 lg:md:px-4 rounded-[10px] ${isSelected ? 'bg-[#eff7f0]' : ''} ${styles['customer-card']} w-full transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-300`}
			onClick={() => {
				selectedUser(customer);
				setSelected(customer);
			}}
		>
			<div className="mt-1">
				{pictureURL && pictureURL != "https://imgurl" ? (
					<Image
						alt="logo"
						width={50}
						height={50}
						className={`${styles.profileimagewrapper}w-10 h-10  object-cover rounded-lg grow-0`}
						src={
							pictureURL ||
							'https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg'
						}
					/>
				) : (
					<div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
				)}
			</div>

			<div className="pl-4 relative w-full justify-center">
				<div className="flex justify-between w-full mt-1">
					<div className="w-8/12">
						<p className="font-normal text-xs text-left">{name || '...'}</p>
					</div>
					<div className={`w-4/12 rounded p-1`} style={{ backgroundColor: TYPE_COLORS[type] }}>
						<p
							className={`font-normal text-[0.65rem] text-white text-center`}
						>
							{type}
						</p>
					</div>
				</div>
				<div className="flex justify-between w-full text-ellipsis">
					<p
						className={`font-normal text-xs text-left  ${styles['customer-card-text1']} text-gray-600 `}
					>
						{businessName || '...'}
					</p>
					{customer?.timeRecordUpdated && (
						<p
							className={`text-xs ${styles['customer-card-text2']} text-right `}
						>
							<Moment fromNow>
								{stampToDate(customer?.timeRecordUpdated)}
							</Moment>
						</p>
					)}
				</div>
				<div className="flex w-full">
					{roles &&
						Array.isArray(myRoles) &&
						myRoles.length > 0 &&
						myRoles.map((role, i) => {
							return (
								<p
									key={i}
									className="font-normal text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1 my-2 mr-2"
								>
									{role}
								</p>
							);
						})}
				</div>
			</div>
		</button>
	);
};

export default CustomerCard;
