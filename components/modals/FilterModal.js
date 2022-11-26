import React, { useState, useEffect, useContext, useRef } from 'react';
//import { fileUpload } from '../../utilities/firebase-functions';
//import { uploadImage, createFBrecord } from '../../utilities/firebase';
import { FBauth } from '../../configs/firebase-config';
import { getIdToken } from 'firebase/auth';
import Input from '../form/Input';
import Image from 'next/image';
import { Context } from '../../context';
import styles from '../../styles/Inbox.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCamera,
	faCircleCheck,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';

function FilterModal({
	display,
	close,
	setManagerFilters,
	setRoleFilters,
	setMembershipFilters,
}) {
	const [show, setShow] = useState(display);
	const { state, dispatch } = useContext(Context);
	const [_customer, _setCustomer] = useState();
	const [managers, setManagers] = useState();
	const [managerKeys, setManagerKeys] = useState([]);
	const [selectedManagers, setSelectedManagers] = useState([]);
	const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
		useState(false);
	const [customerData, setCustomerData] = useState({
		alternativePhoneNumbers: [],
	});
	const [roles, setRoles] = useState('');
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [selectedJoined, setSelectedJoined] = useState([]);
	const joinedStatus = [
		'Not yet on Wakanda',
		'Joined Wakanda',
		'Left Community',
	];
	// useEffect(() => {
	// 	if (state.managers) {
	// 		setManagers(state.managers.managerObject);
	// 		let keys = Object.keys(state.managers.managerObject);
	// 		setManagerKeys(keys);
	// 	}
	// 	if (state.roles && state.roles?.roles) {
	// 		let A = [];
	// 		let ROLES = [...Object.values(state.roles?.roles)];
	// 		ROLES.forEach((role) => {
	// 			let B = [...role];
	// 			A.push(...B);
	// 		});
	// 		let res = [];
	// 		res = A.filter((a, i) => {
	// 			if (A.indexOf(a) === i) return true;
	// 		});
	// 		setRoles(res);
	// 	}
	// }, [state]);
	useEffect(() => {
		setShow(display);
	}, [display]);
	const inputFile = useRef(null);
	return (
		<div
			className={`fixed ${show} z-10 inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full  `}
			id="my-modal"
		>
			<div className="relative  mx-auto mt-4  p-5 border pb-12 lg:w-2/5 md:sm:w-3/5 xs:w-3/4 shadow-lg rounded-lg bg-white">
				<div
					className={`text-left overflow-y-scroll ${styles['add-customer-form']} pb-8`}
				>
					<div
						className={`${styles.header} w-full p-4 px-2 mb-2 font-bold text-xs`}
					>
						Filter
					</div>
					<div className="w-full">
						<div className="text-left font-thin ml-2 text-xs">By Roles</div>
						<div className="w-full flex flex-row justify-between px-1">
							{Array.isArray(roles) &&
								roles.length > 0 &&
								roles.map((item, i) => {
									return (
										<div
											style={{ width: '48%' }}
											key={i}
											className={`w-1/2 bg-gray-50 my-2 p-2 rounded-lg ${
												selectedRoles.includes(item)
													? styles['selected-manager-card']
													: styles['manager-card']
											}`}
											onClick={() => {
												let filtered = [];
												if (selectedRoles.includes(item)) {
													filtered = selectedRoles.filter((role) => {
														if (role != item) return true;
													});
													setSelectedRoles(filtered);
													setRoleFilters(filtered);
												} else {
													filtered = [...selectedRoles, item];
													setSelectedRoles((prev) => {
														return [...prev, item];
													});
													setRoleFilters(filtered);
												}
											}}
										>
											<div className="ml-2 w-3/4 overflow-ellipsis">
												<p className="font-normal text-xs text-green-600 overflow-ellipsis">
													{item}
												</p>
											</div>
											{selectedRoles.includes(item) && (
												<div
													className={`absolute top-2 left-3 ${styles['selected-manager-icon']}`}
												>
													<FontAwesomeIcon
														icon={faCircleCheck}
														style={{ fontSize: 20, color: '#00a85a' }}
													/>
												</div>
											)}
										</div>
									);
								})}
						</div>
					</div>
					<div className="w-full border-b pb-4 my-2">
						<div className="text-left font-thin ml-2 text-xs">
							By memberhip date
						</div>
						<div className="w-full flex flex-row justify-between px-1">
							{Array.isArray(joinedStatus) &&
								joinedStatus.length > 0 &&
								joinedStatus.map((item, i) => {
									return (
										<div
											key={i}
											className={` bg-gray-50 my-2 p-2 rounded-lg mx-1 ${
												selectedJoined.includes(item)
													? styles['selected-manager-card']
													: styles['manager-card']
											}`}
											onClick={() => {
												let filtered_membership = [];
												if (selectedJoined.includes(item)) {
													filtered_membership = selectedJoined.filter(
														(joined) => {
															if (joined != item) return true;
														}
													);
													setSelectedJoined(filtered_membership);
													setMembershipFilters(filtered_membership);
												} else {
													filtered_membership = [...selectedJoined, item];
													setSelectedJoined((prev) => {
														return [...prev, item];
													});
													setMembershipFilters(filtered_membership);
												}
											}}
										>
											<div className="ml-2 w-3/4 overflow-ellipsis">
												<p className="font-normal text-xs text-green-600 overflow-ellipsis">
													{item}
												</p>
											</div>
											{selectedJoined.includes(item) && (
												<div
													className={`absolute top-2 left-3 ${styles['selected-manager-icon']}`}
												>
													<FontAwesomeIcon
														icon={faCircleCheck}
														style={{ fontSize: 20, color: '#00a85a' }}
													/>
												</div>
											)}
										</div>
									);
								})}
						</div>
						<div className="w-full">
							<div className="text-left font-thin ml-2 text-xs">
								By Contact Person
							</div>
							{managers && managerKeys && (
								<div className="mt-2   w-full flex flex-row flex-wrap justify-between">
									{managerKeys.map((_manager, i) => {
										return (
											<div
												key={i}
												className={`flex row  w-2/4 bg-gray-50 my-2 mx-1 p-2 rounded-lg ${
													selectedManagers.includes(_manager)
														? styles['selected-manager-card']
														: styles['manager-card']
												}`}
												onClick={() => {
													let filtered_manager = [];
													if (selectedManagers.includes(_manager)) {
														filtered_manager = selectedManagers.filter(
															(man) => {
																if (man != _manager) return true;
															}
														);
														setSelectedManagers(filtered_manager);
														setManagerFilters(filtered_manager);
													} else {
														filtered_manager = [...selectedManagers, _manager];
														setSelectedManagers((prev) => {
															return [...prev, _manager];
														});
														setManagerFilters(filtered_manager);
													}
												}}
											>
												<div>
													<Image
														alt="logo"
														width={40}
														height={40}
														className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
														src={
															managers[_manager]?.pictureURL ||
															'https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg'
														}
													/>
												</div>

												<div className="ml-2 mt-1 w-3/4 overflow-ellipsis">
													<p className="font-normal text-xs text-green-600 overflow-ellipsis">
														{managers[_manager]?.name}
													</p>
													<p className="font-normal text-xs text-gray-600">
														{managers[_manager]?.businessName}
													</p>
												</div>
												{selectedManagers.includes(_manager) && (
													<div
														className={`absolute top-2 left-3 ${styles['selected-manager-icon']}`}
													>
														<FontAwesomeIcon
															icon={faCircleCheck}
															style={{ fontSize: 20, color: '#00a85a' }}
														/>
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
					<div
						className="absolute  top-8  w-6 p-2 py-0 bg-white opacity-50 hover:opacity-90 right-4 rounded-lg"
						onClick={() => {
							setShow('hidden');
							close();
						}}
					>
						<FontAwesomeIcon
							icon={faXmark}
							style={{
								fontSize: 20,
								color: '#87AC9B',
								alignSelf: 'right',
							}}
						/>
					</div>
					{activityIndicatorAnimating && (
						<div className="absolute bottom-0 w-full left-0 h-full bg-white self-center opacity-70"></div>
					)}
					<div className="absolute items-center px-0 py-3 bottom-0  w-11/12 pl-1 self-center">
						<button
							id="ok-btn"
							className={`${styles['customer-button']} flex flex-row justify-center px-4 py-2 mb-0 text-white text-xs font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}
							onClick={async () => {
								close();
							}}
						>
							Filter
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FilterModal;
