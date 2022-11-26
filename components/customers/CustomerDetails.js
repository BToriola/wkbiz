import { useEffect, useState, useContext } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import styles from '../../styles/Inbox.module.css';
import Image from 'next/image';
import { Context } from '../../context';
import Moment from 'react-moment';
import { stampToDate } from '../../utils/timehelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPen } from '@fortawesome/free-solid-svg-icons';
import EditCustomerModal from '../modals/EditCustomerModal';
function CustomerDetails({ customer }) {
	const { state, dispatch } = useContext(Context);
	const [_customer, _setCustomer] = useState();
	const [managers, setManagers] = useState();
	const [managerKeys, setManagerKeys] = useState([]);
	const [roles, setRoles] = useState();
	const [myRoles, setMyRoles] = useState([]);
	const [showCustomerModal, setShowCustomerModal] = useState('hidden');
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		
		let newfone = customer?.phoneNumber?.substring(13);
		let numm = `tel:${newfone}`;
		
		_setCustomer(customer);
	}, [customer]);
	useEffect(() => {
		if (state.managers) {
			setManagers(state.managers.managerObject);
			let keys = Object.keys(state.managers.managerObject);
			setManagerKeys(keys);
		}
		if (state?.roles && customer) {
			setRoles(state.roles);
			if (!customer?.profileID) {
				setMyRoles([]);
			}
			setMyRoles(state.roles.roles[customer?.profileID]);
		}
	}, [state]);
	return (
		<div
			className={` py-8 w-full bg-white p-8 ${styles.datacard} shadow-lg ring-black rounded-lg `}
			style={{ height: 260 }}
		>
			<div className='"w-full flex'>
				<div className="mt-1">
					{_customer?.pictureURL ? (
						<Image
							alt="logo"
							width={50}
							height={50}
							className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
							src={
								_customer?.pictureURL ||
								'https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg'
							}
						/>
					) : (
						<div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
					)}
				</div>

				<div className={`ml-4 relative w-full  ${styles.dataprofile} truncate`}>
					<div className="flex flex-row justify-between">
						<div>
							<p className="font-normal">{_customer?.name}</p>
							<p className="font-thin text-sm">{_customer?.businessName}</p>
						</div>
						<div className="flex m-2 mr-4 mt-0 h-8 flex-wrap">
							{roles &&
								Array.isArray(state?.roles?.roles[customer?.profileID]) &&
								state.roles.roles[customer?.profileID].length > 0 &&
								state.roles.roles[customer?.profileID].map((role, i) => {
									return (
										<p
											key={i}
											className="font-normal text-xs text-gray-500 bg-gray-100 rounded-sm px-2 py-1 my-1 mr-2"
										>
											{role}
										</p>
									);
								})}
						</div>
					</div>

					<div className="mt-2">
						{_customer?.emailAddress && (
							<a
								href={`mailto: ${_customer?.emailAddress}`}
								target="_blank"
								rel="noreferrer"
							>
								<button
									className={`${styles.button} font-semibold text-xs py-2 px-4  rounded-md mr-2 transition ease-in-out delay-150    hover:scale-101  duration-300`}
								>
									<span>Email</span>
								</button>
							</a>
						)}
						{_customer?.phoneNumber && (
							<a href={`tel:${_customer?.phoneNumber}`}>
								<button
									className={`${styles.button} font-semibold text-xs py-2 px-4  rounded-md transition ease-in-out delay-150    hover:scale-101  duration-300`}
								>
									<span>Call</span>
								</button>
							</a>
						)}
						<div className="flex flex-row items-center mt-0 mb-1">
							{_customer?.profileID && (
								<div className="text-green-500 mt-0">
									<FontAwesomeIcon icon={faGlobe} style={{ fontSize: 15 }} />
								</div>
							)}
							{_customer?.profileID && (
								<a
									href={`https://wakandamarket.com/shop/${_customer?.profileID}`}
									target="_blank"
									rel="noreferrer"
								>
									{/* <p className="font-normal text-gray-500 text-sm">
										Shop Link:{' '}
									</p> */}
									<p className="font-normal text-green-500  mt-0 ml-2 text-xs">
										{`wakandamarket.com/shop/${_customer?.profileID}`}
									</p>
								</a>
							)}
						</div>
					</div>
					<div
						className="absolute right-0 top-0 text-gray-300 hover:text-gray-600"
						onClick={() => setShowCustomerModal('block')}
					>
						<FontAwesomeIcon icon={faPen} style={{ fontSize: 15 }} />
					</div>
				</div>
			</div>
			{managers && managerKeys && (
				<div className="mt-2 ml-14 border-b pb-4 border-gray-500">
					{/* <p className="font-normal text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1 my-2">
						Manager:
					</p> */}
					{managerKeys.map((_manager, i) => {
						if (!_customer?.managerProfileID.includes(_manager)) return;
						return (
							<div key={i} className="flex row">
								<Image
									alt="logo"
									width={30}
									height={30}
									className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
									src={
										managers[_manager]?.pictureURL ||
										'https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg'
									}
								/>
								<div className="ml-2">
									<p className="font-normal text-xs text-green-600">
										{managers[_manager]?.name}
									</p>
									<p className="font-normal text-xs text-gray-600">
										{managers[_manager]?.businessName}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
			<div className='"w-full flex mt-2 pl-10'>
				<div className={`ml-4 relative w-full`}>
					{/* 	{_customer?.timeJoinedWakanda && (
						<p className="font-thin ">
							<span className="text-green-700 text-xs">Joined Wakanda: </span>
							<Moment fromNow className="text-xs text-gray-500">
								{stampToDate(_customer?.timeJoinedWakanda)}
							</Moment>
						</p>
					)} */}
					{_customer?.timeRecordCreated && (
						<p className="font-thin text-xs">
							<span className="text-green-700">Record created </span>
							<Moment fromNow className="text-xs text-gray-500">
								{stampToDate(_customer?.timeRecordCreated)}
							</Moment>
						</p>
					)}
					{/* {_customer?.timeRecordUpdated && (
						<p className="font-thin text-xs">
							<span className="text-green-700">Last updated </span>
							<Moment fromNow className="text-xs text-gray-500">
								{stampToDate(_customer?.timeRecordUpdated)}
							</Moment>
						</p>
					)} */}
				</div>
			</div>
			<EditCustomerModal
				data={_customer}
				display={showCustomerModal}
				close={() => {
					setShowCustomerModal('hidden');
				}}
			/>
		</div>
	);
}

export default CustomerDetails;
