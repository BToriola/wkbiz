import React, { useState, useEffect, useContext, useRef } from 'react';
import Input from '../form/Input';
import Image from 'next/image';
import styled from 'styled-components';
import { Context } from '../../context';
import styles from '../../styles/Inbox.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faExclamation,
	faExclamationCircle,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { multiCreateFBrecords } from '../../utils/firebase';
import { useTable } from 'react-table';

const Styles = styled.div`
	padding: 1rem;
	padding-left: 0;
	table {
		border-spacing: 0;
		border: 1px solid gray;

		tr {
			:nth-of-type(even) {
				background: #eff7f0;
			}
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid gray;
			border-right: 1px solid gray;
			color: gray;
			:last-child {
				border-right: 0;
			}
		}
	}
`;

const Table = ({ columns, data }) => {
	// Use the useTable Hook to send the columns and data to build the table
	const {
		getTableProps, // table props from react-table
		getTableBodyProps, // table body props from react-table
		headerGroups, // headerGroups, if your table has groupings
		rows, // rows for the table based on the data passed
		prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
	} = useTable({
		columns,
		data,
	});
	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup, i) => (
					<tr {...headerGroup.getHeaderGroupProps()} key={i}>
						{headerGroup.headers.map((column, k) => (
							<th {...column.getHeaderProps()} className="text-xs" key={k}>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()} key={i}>
							{row.cells.map((cell, k) => {
								return (
									<td {...cell.getCellProps()} className="text-xs" key={k}>
										{cell.render('Cell')}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const customerDataModel = [
	{
		id: 'name',
		title: 'Name',
		required: true,
	},
	{
		id: 'businessName',
		title: 'Business Name',
		required: true,
	},
	{
		id: 'emailAddress',
		title: 'Email Address',
		required: true,
	},
	{
		id: 'phoneNumber',
		title: 'Phone Number',
		required: true,
	},
	{
		id: 'alternativePhoneNumber1',
		title: 'Alt. Phone Number 1',
		required: true,
	},
	{
		id: 'alternativePhoneNumber2',
		title: 'Alt. Phone Number 2',
		required: true,
	},
];

function CSVimportModal({ display, close, reload }) {
	const [show, setShow] = useState(display);
	const { state, dispatch } = useContext(Context);
	const [_customer, _setCustomer] = useState();
	const [file, setFile] = useState();
	const [array, setArray] = useState([]);
	const [columns, setColumns] = useState([]);
	const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
		useState(false);
	const inputCSV = useRef(null);
	const dataRemapKeys = {
		name: '',
		businessName: '',
		emailAddress: '',
		phoneNumber: '',
		managerProfileID: '',
		alternativePhoneNumber1: '',
		alternativePhoneNumber2: '',
	};
	const [remapKeys, setRemapKeys] = useState(dataRemapKeys);
	//const [remappedHeaderKeys, setRemappedHeaderKeys] = useState([]);
	const [remappedArrays, setRemappedArrays] = useState([]);
	const [uploadMessage, setUploadMessage] = useState('');
	const fileReader = new FileReader();
	// const fileReader = null

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};

	const onButtonClick = () => {
		inputCSV.current?.click();
	};

	const csvFileToArray = (string) => {
		const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
		const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');
		const array = csvRows.map((i) => {

			const values = i.split(',');
			const obj = csvHeader.reduce((object, header, index) => {
				object[header] = values[index];
				return object;
			}, {});
			return obj;
		});
		setArray(array);
	};

	const generateCols = (headerKeys) => {
		if (!Array.isArray(headerKeys) && headerKeys.length == 0) return;
		let columns = headerKeys.map((header, i) => {
			return {
				Header: header,
				accessor: header.substring(0, header.length),
			};
		});
		return columns;
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();
		//setRemappedArrays([]);
		setRemapKeys(dataRemapKeys);
		if (file) {
			fileReader.onload = function (event) {
				const text = event.target.result;
				csvFileToArray(text);
			};

			fileReader.readAsText(file);
		}
	};

	const remapDataFunc = () => {
		if (!array) return;
		let values = Object.values(remapKeys);
		let result = array.map((data, i) => {
			return {
				name: data[remapKeys?.name] || '',
				businessName: data[remapKeys?.businessName] || '',
				emailAddress: data[remapKeys?.emailAddress] || '',
				phoneNumber: data[remapKeys?.phoneNumber] || '',
				//managerProfileID: state?.user?.idProfile || '',
				alternativePhoneNumber1: data[remapKeys?.alternativePhoneNumber1] || '',
				alternativePhoneNumber2: data[remapKeys?.alternativePhoneNumber2] || '',
			};
		});
		setRemappedArrays((prev) => {
			return result;
		});
	};

	const uploadRecords = async () => {
		if (activityIndicatorAnimating) return;
		setActivityIndicatorAnimating(true);
		let managerProfileID = state?.user?.idProfile || localStorage.getItem('profileID');
		try {
			let res = await multiCreateFBrecords(remappedArrays, managerProfileID);
			if (res.msg === 'SUCCESS') {
				await reload();
				alert('successfully created records!');
				setShow('hidden');
				close();
			} else {
				alert('something went wrong...');
			}
			setActivityIndicatorAnimating(false);
		} catch (err) {
			setActivityIndicatorAnimating(false);
			alert('something went wrong like mad!...');
		}
	};

	const headerKeys = Object.keys(Object.assign({}, ...array));
	const remappedHeaderKeys = Object.keys(Object.assign({}, ...remappedArrays));

	useEffect(() => {
		setShow(display);
	}, [display]);

	useEffect(() => {
	}, [file]);

	return (
		<div
			className={`fixed ${show} z-10 inset-0 bg-gray-900 bg-opacity-80 w-full `}
			id="my-modal"
		>
			<div
				className="relative  mx-auto mt-4  p-5 border pb-12 w-11/12 shadow-lg rounded-lg bg-white overflow-hidden"
				style={{ height: '80vh', overflowY: 'scroll' }}
			>
				<div className={`text-left ${styles['add-customer-form']} pb-4`}>
					<div
						className={`${styles.header} w-full px-2 mb-2 font-bold flex flex-row items-center justify-start`}
					>
						<div className="text-xs mb-4">
							{' '}
							Import {file?.name && '| ' + file?.name}
						</div>
						<div
							className={`flex justify-end ml-2 ${styles['customer-button-menu']}`}
						>
							<button
								className={`${styles.button} ml-2  font-semibold px-4 border rounded-lg`}
								onClick={() => onButtonClick()}
							>
								<input
									type={'file'}
									ref={inputCSV}
									style={{ display: 'none' }}
									id={'csvFileInput'}
									accept={'.csv'}
									onChange={(e) => handleOnChange(e)}
								/>
								<span className="text-xs">Select CSV</span>
							</button>
							<button
								className={`${styles.button} ml-2 mr-2 font-semibold py-2 px-4 border rounded-lg`}
								onClick={(e) => handleOnSubmit(e)}
							>
								<span className="text-xs">Import CSV</span>
							</button>
						</div>
					</div>
					<div
						id="content"
						className="flex flex-col w-full overflow-x-scroll overflow-y-scroll pb-52 h-full"
					>
						{Array.isArray(headerKeys) && headerKeys.length > 0 && (
							<div className="pl-4 border border-gray-400  overflow-x-scroll py-2  p-4 rounded-lg flex space-x-3 justify-between">
								<div className='flex items-center w-[80%] overflow-auto'>
									{customerDataModel.map((cdataItem, m) => {
										return (
											<div key={m} className="m-1 flex items-center space-x-1">
												<div className="flex items-center space-x-2">
													<p className="text-xs font-bold whitespace-nowrap">{cdataItem.title} :</p>
													<p className="text-xs"> {remapKeys[cdataItem.id]}
													</p>
												</div>
												<select
													name={cdataItem.title}
													id={cdataItem.id}
													className="text-xs focus:outline-none p-0 px-2 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500"
													value={remapKeys[cdataItem?.id] || ''}
													onChange={(e) => {

														let remkeys = remapKeys;
														remkeys[cdataItem.id] = e.target.value;
														setRemapKeys((prev) => {
															return {
																...prev,
																[cdataItem.id]: e.target.value,
															};
														});
													}}
												>
													<option value={''} className="text-xs">
														none
													</option>
													{headerKeys.map((item, i) => {
														return (
															<option value={item} className="text-xs" key={i}>
																{item}
															</option>
														);
													})}
												</select>
											</div>
										);
									})}
								</div>
								<div className="flex space-x-3">
									<button
										className={`whitespace-nowrap bg-green-600 font-semibold py-2  h-full px-4 border rounded-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-200`}
										onClick={(e) => {
											remapDataFunc();
										}}
									>
										<span className="text-xs text-slate-100">OK, Remap!</span>
									</button>
									<button
										className={`whitespace-nowrap bg-gray-500 font-semibold py-2  h-full px-4 border rounded-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-200`}
										onClick={(e) => {
											//remapDataFunc();
											setUploadMessage('uploading records...');
											uploadRecords();
										}}
										disabled={
											Array.isArray(remappedArrays) && remappedArrays.length > 0
												? false
												: true
										}
									>
										<span className="text-xs text-slate-100">OK, Upload!</span>
									</button>
								</div>
							</div>
						)}
						{array && (remappedArrays.length == 0 || !remappedArrays) && (
							<Styles>
								<Table columns={generateCols(headerKeys)} data={array} />
							</Styles>
						)}
						{Array.isArray(remappedArrays) && remappedArrays.length > 0 && (
							<Styles>
								<Table
									columns={generateCols(remappedHeaderKeys)}
									data={remappedArrays}
								/>
							</Styles>
						)}
					</div>
				</div>

				<div
					className="absolute top-8 w-6 p-2 py-0 bg-white opacity-50 hover:opacity-90 right-4 rounded-lg"
					onClick={() => {
						setArray([]);
						setRemapKeys(dataRemapKeys);
						setRemappedArrays((prev) => {
							return [];
						});
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
					<div className="fixed  mx-auto p-4 items-center justify-center bottom-12 right-14 z-50 bg-white  rounded-lg shadow-2xl w-60 h-16 border border-green-500 transition ease-in-out delay-150  hover:-translate-y-2 hover:scale-102  duration-200">
						<FontAwesomeIcon
							icon={faExclamationCircle}
							style={{
								fontSize: 20,
								color: '#87AC9B',
								//alignSelf: 'right',
							}}
						/>
						<span className="text-xs text-gray-500 ml-4">{uploadMessage}</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default CSVimportModal;
