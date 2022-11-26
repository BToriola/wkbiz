import React, { useState, useEffect, useContext, useRef } from 'react';
//import { fileUpload } from '../../utilities/firebase-functions';
import { uploadImage, createFBrecord, uploadCustomerImage } from '../../utils/firebase';
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
import { createCustomer, updateCustomer } from '../../pages/api/customerApi';
import notificationService from '../../services/notification.service';

function CustomerModal({ display, close, reload, customer }) {
	const [show, setShow] = useState(display);
	const { state, dispatch } = useContext(Context);
	const [_customer, _setCustomer] = useState();
	const [managers, setManagers] = useState();
	const [managerKeys, setManagerKeys] = useState([]);
	const [selectedManager, setSelectedManager] = useState();
	const [idToken, setIDtoken] = useState();
	const [uid, setUID] = useState('');
	const [currentService, setCurrentService] = useState("")
	const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
		useState(false);
	const [customerData, setCustomerData] = useState({
		businessName: "", emailAddress: "", name: "", phoneNumber: "", pictureURL: "", representativeProfileID: "", alternativePhoneNumbers: "", services: []
	});
	const [pictureURL, setPictureURL] = useState('');
	const [pictureFile, setPictureFile] = useState('');
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
	const createOrUpdateRecord = async () => {

		const customerPayload = { ...customerData };

		if (customerPayload.services.length <= 0) {
			return notificationService.warning("Please add at least one service")
		}
		if (!pictureFile && !customerPayload.pictureURL) {
			return notificationService.warning("You have to upload an image to proceed")
		}

		if (activityIndicatorAnimating) return;
		setActivityIndicatorAnimating(true);


		if (customerPayload.pictureURL) {
			delete customerPayload.pictureURL
		} else {
			const imageURL = await uploadCustomerImage(pictureFile);
			customerPayload.pictureURL = imageURL
		}

		if (customerData.timeCustomerCreated) {
			delete customerPayload.representativeProfileID
			await updateCustomer(customerPayload)
		} else {
			await createCustomer(customerPayload)
		}
		// const r = await createFBrecord(customerData, pictureURL, pictureFile);

		setActivityIndicatorAnimating(false);
		notificationService.success(customerData.timeCustomerCreated ? "Customer updated successfully" : "Customer created successfully")
		setShow('hidden');
		close();
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
	const onImageChange = async (event) => {
		if (event.target.files && event.target.files[0]) {
			setPictureFile(event.target.files[0]);

			let reader = new FileReader();
			reader.onload = (e) => {
				setPictureURL(e.target.result);
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	};

	const removeService = (_index) => {
		const updatedServices = customerData.services.filter((service, index) => index !== _index)
		setCustomerData((prev) => {
			return { ...prev, services: updatedServices }
		})
	}


	useEffect(() => {
		getIDtoken();
		getUserID();
	}, []);

	useEffect(async () => {
		if (customer) {
			await setCustomerData({ services: [], ...customer })
			setPictureURL(customerData.pictureURL)
		}
	}, [customer])

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
				<form onSubmit={async (e) => {
					e.preventDefault();
					createOrUpdateRecord();
				}}
					className={`text-left overflow-y-scroll ${styles['add-customer-form']} pb-8`}
				>
					<div className={`${styles.header} w-full p-4 px-2 mb-2 font-bold`}>
						Add new customer
					</div>
					<div
						className={`${styles['image-holder']} rounded-lg flex flex-col justify-center items-center transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-300`}
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
								className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0 `}
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
						value={customerData.name}
						placeholder={'Enter customer name'}
						required={true}
						onChange={(e) => {
							setCustomerData((prev) => {
								return { ...prev, name: e };
							});
						}}
					/>
					<Input
						title={'Business Name'}
						value={customerData.businessName}
						placeholder={'Enter business name'}
						required={true}
						onChange={(e) => {
							setCustomerData((prev) => {
								return { ...prev, businessName: e };
							});
						}}
					/>
					<Input
						title={'Email'}
						value={customerData.emailAddress}
						placeholder={'Enter email'}
						type="email"
						required={true}
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
							value={customerData.phoneNumber}
							placeholder={'08123456789'}
							required={true}
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
							value={customerData.alternativePhoneNumbers}
							placeholder={'08123456789'}
							required={true}
							onChange={(e) => {
								let altNums = customerData?.alternativePhoneNumbers || [];
								altNums[0] = e;
								setCustomerData((prev) => {
									return { ...prev, alternativePhoneNumbers: altNums };
								});
							}}
						/>
					</div>
					<div className="w-full">
						<div className="text-left font-thin ml-1">Contact Person</div>
						{managers && managerKeys && (
							<div className="mt-2  border-b pb-4  w-full flex flex-row flex-wrap justify-between">
								{managerKeys.map((_manager, i) => {
									return (
										<div
											key={i}
											className={`flex row  w-2/4 bg-gray-50 my-2 mx-1 p-2 rounded-lg ${selectedManager === _manager
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
					<div className='flex items-end justify-center space-x-4'>
						<Input
							className="w-full"
							title={'Services'}
							value={currentService}
							placeholder={'Enter services provided'}
							onChange={(e) => {
								setCurrentService(e)
							}}
						/>
						<div className='bg-green-700 rounded-md cursor-pointer p-2 px-3 mb-3'
							onClick={async () => {
								const tempServices = customerData.services
								tempServices.push(currentService)
								await setCustomerData((prev) => {
									return { ...prev, services: tempServices }
								})
								setCurrentService("")
							}}>
							<span className='whitespace-nowrap text-xs uppercase font-semibold text-white'>Add Service</span>
						</div>
					</div>
					{customerData.services?.length > 0 && Array.isArray(customerData.services) ? (
						<div className='flex items-center space-x-4 w-full overflow-auto mb-4'>
							{customerData.services.map((service, index) => {
								return (
									<div key={index} className='flex space-x-4 items-center p-2 px-4 bg-green-300 rounded-md'>
										<span className='select-none whitespace-nowrap'>
											{service}
										</span>
										<div className='cursor-pointer' onClick={() => removeService(index)}>
											<FontAwesomeIcon
												icon={faXmark}
												style={{ fontSize: 14 }}
											/></div>
									</div>
								)
							})}
						</div>
					) : null}
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
							className={`${styles['customer-button']} flex flex-row justify-center px-4 py-2 mb-0 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}

						>
							{activityIndicatorAnimating
								? `${customerData?.timeCustomerCreated ? 'Updating record...' : 'Creating record...'}`
								: `${customerData?.timeCustomerCreated ? 'Update Customer' : 'Add New Customer'}`}
						</button>
					</div>
				</form>
			</div>
		</div >
	);
}

export default CustomerModal;
