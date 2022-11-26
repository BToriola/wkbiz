import React, { useState, useEffect, useContext, useRef } from 'react';
//import { fileUpload } from '../../utilities/firebase-functions';
import { updateFBrecord } from '../../utils/firebase';
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

function EditCustomerModal({ display, close, data }) {
	const [show, setShow] = useState(display);
	const { state, dispatch } = useContext(Context);
	const [_customer, _setCustomer] = useState();
	const [managers, setManagers] = useState();
	const [managerKeys, setManagerKeys] = useState([]);
	const [selectedManager, setSelectedManager] = useState();
	const [idToken, setIDtoken] = useState();
	const [uid, setUID] = useState('');
	const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
		useState(false);
	const [customerData, setCustomerData] = useState({
		alternativePhoneNumbers: [],
		...data,
	});
	const [pictureURL, setPictureURL] = useState('');
	const getUserID = async () => {
		if (uid) return;
		const uid = await FBauth.currentUser?.uid;
		if (!uid) return;
		setUID(uid);
	};
	const getIDtoken = async () => {
		const { currentUser } = FBauth;
		if (!currentUser) return;
		const token = await getIdToken(currentUser, true);
		setIDtoken(token);
	};

	const formatPhoneNumbers = async () => {
		alternativePhoneNumbers = alternativePhoneNumbers.filter(
			(a) => a !== '' && a !== '+234' && a !== '+233'
		); //experimental code
		if (alternativePhoneNumbers?.length > 0) {
			if (!phoneNumber || phoneNumber == '+234' || phoneNumber == '+233')
				await removeMainPhoneNumber();
			alternativePhoneNumbers = alternativePhoneNumbers.map((phoNum) => {
				//experimental
				if (phoNum != '+' + phoNum.substring(1, 99).replace(/\D/g, ''))
					return '+' + phoNum.substring(0, 99).replace(/\D/g, '');
				else return phoNum;
			});
		}
		if (phoneNumber) {
			if (
				phoneNumber !=
				'+' + phoneNumber.substring(1, 99).replace(/\D/g, '')
			) {
				setPhoneNumber('+' + phoneNumber.substring(0, 99).replace(/\D/g, ''));
			}
		}
	};
	const dataValid = () => {
		if (!name) {
			return alert('Enter a name');
		} else if (phoneNumber && !phoneNumber.startsWith('+')) {
			return alert('Phone number needs to start with +');
		} else if (phoneNumber.startsWith('+234') && phoneNumber.length > 14) {
			return alert('Phone number is too long');
		} else if (phoneNumber.startsWith('+234') && phoneNumber.length < 14) {
			return alert('Phone number is too short');
		} else if (phoneNumber.startsWith('+233') && phoneNumber.length > 13) {
			return alert('Phone number is too long');
		} else if (phoneNumber.startsWith('+233') && phoneNumber.length < 13) {
			return alert('Phone number is too short');
		} else if (phoneNumber && phoneNumber.length < 10) {
			return alert('Phone number too short');
		} else if (
			emailAddress &&
			(!emailAddress.includes('@') || !emailAddress.includes('.'))
		) {
			return alert('Email address not valid');
		} else if (!managerKeys.includes(managerProfileID)) {
			return alert('You need to select a valid personal contact');
		} else return true;
	};
	const onButtonClick = () => {
		inputFile.current?.click();
	};
	const onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader();
			reader.onload = (e) => {
				setPictureURL(e.target.result);
				//this.setState({image: e.target.result});
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	};
	const updateRecord = async () => {
		//return;
		try {
			if (activityIndicatorAnimating) return;
			setActivityIndicatorAnimating(true);
			const r = await updateFBrecord(customerData);
			setActivityIndicatorAnimating(false);
			if (r.msg === 'SUCCESS') {
				alert('Success!');
				setShow('hidden');
				close();
			} else {
				alert('Not successful. Try again');
			}
		} catch (e2) {
			alert('An error occurred. Please try again', e2);
			//global.warn(e2, 'E5createRecord');
			setActivityIndicatorAnimating(false);
		}
	};
	useEffect(() => {
		if (state.managers) {
			setManagers(state.managers.managerObject);
			let keys = Object.keys(state.managers.managerObject);
			setManagerKeys(keys);
		}
	}, [state]);
	useEffect(() => {
		getIDtoken();
		getUserID();
	}, []);
	useEffect(() => {
		setShow(display);
	}, [display]);
	useEffect(() => {
		setCustomerData((prev) => {
			return {
				alternativePhoneNumbers: [],
				...data,
			};
		});
		setSelectedManager(data?.managerProfileID);
		setPictureURL(data?.pictureURL);
	}, [data]);
	const inputFile = useRef(null);
	return (
		<div
			className={`fixed ${show} z-10 inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full `}
			id="my-modal"
		>
			<div className="relative  mx-auto mt-4  p-5 border pb-16 lg:w-2/5 md:sm:w-3/5 xs:w-3/4 shadow-lg rounded-lg bg-white">
				<div
					className={`text-left overflow-y-scroll ${styles['add-customer-form']} pb-8`}
				>
					<div className={`${styles.header} w-full p-4 px-2 mb-2 font-bold`}>
						customer
					</div>
					<div
						className={`${styles['image-holder']} rounded-lg flex flex-col justify-center items-center`}
						onClick={onButtonClick}
					>
						{' '}
						<input
							type="file"
							id="file"
							ref={inputFile}
							style={{ display: 'none' }}
							onChange={onImageChange}
						/>
						{pictureURL && (
							<Image
								alt="logo"
								width={150}
								height={150}
								className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
								src={pictureURL}
								//onClick={onButtonClick}
							/>
						)}
						{!pictureURL && (
							<FontAwesomeIcon
								icon={faCamera}
								style={{
									fontSize: 36,
									color: '#87AC9B',
								}}
							/>
						)}
						{!pictureURL && (
							<div className="text-center">
								Profile <br /> Picture
							</div>
						)}
					</div>
					<Input
						title={'Full Name'}
						value={customerData?.name}
						placeholder={'enter customer name'}
						required
						onChange={(e) => {
							setCustomerData((prev) => {
								return { ...prev, name: e };
							});
						}}
					/>
					{/* <p className="text-red-500 text-xs italic">Please enter a name.</p> */}
					<Input
						title={'Business Name'}
						value={customerData?.businessName}
						placeholder={'enter business name'}
						onChange={(e) => {
							setCustomerData((prev) => {
								return { ...prev, businessName: e };
							});
						}}
					/>
					<Input
						title={'Email'}
						value={customerData?.emailAddress}
						placeholder={'enter email'}
						onChange={(e) => {
							setCustomerData((prev) => {
								return { ...prev, emailAddress: e };
							});
						}}
					/>
					<div className="w-full flex flex-row">
						<Input
							className="w-1/4  "
							title={'Phone Number'}
							value={customerData?.phoneNumber}
							placeholder={'enter phone number'}
							onChange={(e) => {
								setCustomerData((prev) => {
									return { ...prev, phoneNumber: e };
								});
							}}
						/>
						<span className="px-2"></span>
						<Input
							className="w-1/4"
							title={'Alt. Number'}
							value={customerData?.alternativePhoneNumbers[0] || ''}
							placeholder={'enter phone number'}
							onChange={(e) => {
								let altNums = customerData?.alternativePhoneNumbers || [];
								altNums[0] = e;
								setCustomerData((prev) => {
									return { ...prev, alternativePhoneNumbers: altNums };
								});
							}}
						/>
						<span className="px-2"></span>
						<Input
							className="w-1/4 "
							title={'Alt. Number'}
							value={customerData?.alternativePhoneNumbers[1] || ''}
							placeholder={'enter phone number'}
							onChange={(e) => {
								let altNums = customerData?.alternativePhoneNumbers || [];
								altNums[1] = e;
								setCustomerData((prev) => {
									return { ...prev, alternativePhoneNumbers: altNums };
								});
							}}
						/>
					</div>
					<div className="w-full">
						<div className="text-left font-thin ml-1">Contact Person</div>
						{selectedManager && managers && (
							<div
								className={`flex row bg-gray-50 my-2 mx-1 p-2 rounded-lg ${styles['selected-manager-card2']} `}
								onClick={() => {
									setSelectedManager('');
								}}
							>
								<div>
									<Image
										alt="logo"
										width={40}
										height={40}
										className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
										src={
											managers[selectedManager]?.pictureURL ||
											'https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg'
										}
									/>
								</div>

								<div className="ml-2 w-3/4 overflow-ellipsis">
									<p className="font-normal text-sm text-green-600 overflow-ellipsis">
										{managers[selectedManager]?.name}
									</p>
									<p className="font-normal text-sm text-gray-600">
										{managers[selectedManager]?.businessName}
									</p>
								</div>
							</div>
						)}
						{!selectedManager && managers && managerKeys && (
							<div className="mt-2  border-b pb-4  w-full flex flex-row flex-wrap justify-between">
								{managerKeys.map((_manager, i) => {
									return (
										<div
											key={i}
											className={`flex row  w-2/4 bg-gray-50 my-2 mx-1 p-2 rounded-lg ${
												selectedManager === _manager
													? styles['selected-manager-card']
													: styles['manager-card']
											}`}
											onClick={() => {
												setSelectedManager(_manager);
												setCustomerData((prev) => {
													return { ...prev, managerProfileID: _manager };
												});
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

											<div className="ml-2 w-3/4 overflow-ellipsis">
												<p className="font-normal text-sm text-green-600 overflow-ellipsis">
													{managers[_manager]?.name}
												</p>
												<p className="font-normal text-sm text-gray-600">
													{managers[_manager]?.businessName}
												</p>
											</div>
											{customerData?.managerProfileID === _manager && (
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
					<div className="absolute items-center px-0 py-3 bottom-0  w-11/12 self-center pl-2">
						<button
							id="ok-btn"
							className={`${styles['customer-button']} p-2 text-white text-base font-medium rounded-md w-full shadow-lg  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-300 `}
							onClick={async () => {
								updateRecord();
							}}
						>
							{/* <FontAwesomeIcon
								icon={faCircleHalfStroke}
								style={{
									fontSize: 20,
									color: '#87AC9B',
								}}
							/> */}
							{activityIndicatorAnimating
								? 'updating record...'
								: 'Update customer record'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditCustomerModal;
