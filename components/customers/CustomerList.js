import { useEffect, useState, useContext, useRef } from 'react';
import { Context } from '../../context';
import styles from '../../styles/Inbox.module.css';
import plusButtonStyle from '../../styles/PlusButton.module.css';
import CustomerCard from './CustomerCard';
import CustomerModal from '../modals/CustomerModal';
import CSVimportModal from '../modals/CSVimportModal';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { FBdb } from '../../configs/firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, fa1, fa2, fa3 } from '@fortawesome/free-solid-svg-icons';
import FilterModal from '../modals/FilterModal';
// Import the FontAwesomeIcon component

function CustomerList({ setUpdate, updateManagers }) {
	const { state, dispatch } = useContext(Context);
	const [showCustomerModal, setShowCustomerModal] = useState('hidden');
	const [showFilterModal, setShowFilterModal] = useState('hidden');
	const [showCSVModal, setShowCSVModal] = useState('hidden');
	const [customers, setCustomers] = useState([]);
	const [managers, setManagers] = useState();
	const [communityDoc, setCommmunityDoc] = useState();
	const [selected, setSelected] = useState();
	const [searchTerm, setSearchTerm] = useState('');
	const [managerFilters, setManagerFilters] = useState([]);
	const [roleFilters, setRoleFilters] = useState([]);
	const [membershipFilters, setMembershipFilters] = useState([]);
	const [file, setFile] = useState('');
	const [array, setArray] = useState([]);
	const inputCSV = useRef(null);
	let filterBadge = 0;
	if (managerFilters.length > 0) filterBadge += 1;
	if (membershipFilters.length > 0) filterBadge += 1;
	if (roleFilters.length > 0) filterBadge += 1;

	const getAllCustomers = async () => {
		//if (state.members && state.members.length > 0) return;
		let CUSTOMERS = [];
		const docRef = collection(
			FBdb,
			'Organizations',
			'i0OAsUwlAPnbV5JvnDJX',
			'Customers'
		);
		const membersSnap = await getDocs(docRef);
		membersSnap.forEach((snap) => {
			const ir = snap.data();
			ir.xID = snap.id;
			CUSTOMERS.push(ir);
		});
		setCustomers(CUSTOMERS);
	};

	const loadManagers = async (c) => {
		try {
			const managerObject = {};
			await Promise.all(
				c.managerProfileIDs.map(async (pID) => {
					try {
						const pDocRef = doc(FBdb, 'Profiles', pID);
						const docSnap = await getDoc(pDocRef);
						const p = docSnap.data();
						managerObject[pID] = {
							profileID: pID,
							name: p.profileName,
							businessName: p.profileNameBusiness,
							pictureURL: p.profilePictureURL,
						};
					} catch (e) {
						console.warn(e, 'LMS1');
					}
				})
			);

			setManagers(managerObject);
			dispatch({
				type: 'MANAGERS',
				payload: { managerObject, managersLoaded: true },
			});
		} catch (e) {
			console.warn(e, 'lM99');
		}
	};

	const loadCommunity = async () => {
		const pDocRef = doc(FBdb, 'Communities', 'UwpulrxrXY5nIvZjIIYL');
		const comDoc = await getDoc(pDocRef);
		if (!comDoc.exists) {
			alert("This community doesn't exist!");
			return;
		}
		const com = comDoc.data();
		setCommmunityDoc(com);
		await loadManagers(com);
	};

	useEffect(() => {
		getAllCustomers();
		//loadCommunity();
	}, []);

	useEffect(() => {
		setUpdate(selected);
	}, [selected]);
	/* 
	
	useEffect(() => {
		updateManagers(managers);
	}, [managers]);
	useEffect(() => {
		
		setSearchTerm(state.search_term);
	}, [state.search_term]); */
	return (
		<div
			className={`relative shadow-lg ring-black w-96 bg-white py-4 px-4 lg:col-span-2 md:col-span-2 rounded-lg ${styles['customer-list-wrapper']}`}
			style={{ height: '85vh' }}
		>
			<div
				className={`${styles.header} flex flex-row justify-between items-center w-full p-4 px-2 mb-2 pt-2 `}
			>
				<div className="font-bold ">Customers</div>
				<div
					className="relative "
					onClick={() => {
						setShowFilterModal('block');
					}}
				>
					<FontAwesomeIcon
						icon={faFilter}
						style={{ fontSize: 20, color: '#87AC9B' }}
					/>
					{filterBadge > 0 ?
						<div
							className={`absolute top-0 right-0  bg-red-400 p-1 rounded-sm py-0 h-5 px-2  `}
						>
							<FontAwesomeIcon
								icon={fa1}
								style={{ fontSize: 8, color: '#FFF', marginBottom: 5 }}
							/>
						</div>
						: (
							<div></div>
						)}
				</div>
			</div>
			<div className={`h-full overflow-y-scroll ${styles['customer-list']}`}>
				{customers.map((customer, i) => {
					if (!customer) return;
					return (
						<CustomerCard customer={customer} key={customer.xID} isSelected={customer.xID == selected?.xID}
							selectedUser={(val) => {
								setSelected(val);
								//setUpdate(val)
							}}
						/>

					);
				})}
				<div className="h-28"></div>
			</div>
			<div
				className={`absolute w-full flex justify-end bottom-0 right-0 pr-8 ${styles['customer-button-menu']}`}
			>
				<button
					className={`${styles.button} ml-2 mr-2 font-semibold py-2 px-4 border rounded-lg`}
					//onClick={() => onButtonClick()}
					onClick={() => setShowCSVModal('block')}
				>
					<span className="text-xs">Import CSV</span>
				</button>
				<button
					className={`${plusButtonStyle['plus']} text-white font-bold py-2  rounded-full`}
					onClick={() => setShowCustomerModal('block')}
				>
					+
				</button>
			</div>
			<CustomerModal
				display={showCustomerModal}
				close={() => {
					setShowCustomerModal('hidden');
					getAllCustomers();
				}}
				reload={() => {
					getAllCustomers();
				}}
			/>
			<CSVimportModal
				display={showCSVModal}
				close={() => {
					setShowCSVModal('hidden');
				}}
				reload={() => {
					getAllCustomers();
				}}
			/>
			<FilterModal
				display={showFilterModal}
				setManagerFilters={(val) => setManagerFilters(val)}
				setRoleFilters={(val) => setRoleFilters(val)}
				setMembershipFilters={(val) => setMembershipFilters(val)}
				close={() => {
					setShowFilterModal('hidden');
				}}
			/>
		</div>
	);
}

export default CustomerList;
