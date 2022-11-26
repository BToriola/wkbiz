import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Inbox.module.css";
import plusButtonStyle from "../../styles/PlusButton.module.css";

const CustomerView = ({ Customers, passSelectedCustomer }) => {
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [customerData, setCustomerData] = useState({
    alternativePhoneNumbers: [],
  });
  const [customerID, setCustomerID] = useState();
  const [customers, setCustomers] = useState();
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(false);

  return (
    <>
      <div className="w-full">
        <div className="text-left font-thin ml-1">Contact Person</div>
        {Customers && (
          <div className="mt-2  border-b pb-4  w-full flex flex-row flex-wrap justify-between">
            {Customers.map((_customer, i) => {
              return (
                <div
                  key={i}
                  className={`flex row  w-2/4 bg-gray-50 my-2 mx-1 p-2 rounded-lg ${
                    selectedCustomer === _customer
                      ? styles["selected-manager-card"]
                      : styles["manager-card"]
                  }`}
                  onClick={() => {
                    setSelectedCustomer(_customer);
                    setCustomerID(_customer.xID);
                    passSelectedCustomer(customerID);
                    // setCustomerData((prev) => {
                    //   return { ...prev, managerProfileID: _customer };
                    // });
                  }}
                >
                  <div>
                    <Image
                      alt="logo"
                      width={40}
                      height={40}
                      className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
                      src={
                        _customer?.pictureURL ||
                        "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"
                      }
                    />
                  </div>

                  <div className="ml-2 w-3/4 overflow-ellipsis">
                    <p className="font-normal text-sm text-green-600 overflow-ellipsis">
                      {_customer?.name}
                    </p>
                    <p className="font-normal text-sm text-gray-600">
                      {_customer?.businessName}
                    </p>
                  </div>

                  <div
                    className={`absolute top-2 left-3 ${styles["selected-manager-icon"]}`}
                  >
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ fontSize: 20, color: "#00a85a" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        className="absolute  top-8  w-6 p-2 py-0 bg-white opacity-50 hover:opacity-90 right-4 rounded-lg"
        onClick={() => {
          setShow("hidden");
          close();
        }}
      >
        <FontAwesomeIcon
          icon={faXmark}
          style={{
            fontSize: 20,
            color: "#87AC9B",
            alignSelf: "right",
          }}
        />
      </div>
      {activityIndicatorAnimating && (
        <div className="absolute bottom-0 w-full left-0 h-full bg-white self-center opacity-70"></div>
      )}
      <div className="absolute items-center px-0 py-3 bottom-0  w-11/12 pl-1 self-center">
        <button
          id="ok-btn"
          className={`${styles["customer-button"]} flex flex-row justify-center px-4 py-2 mb-0 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}
          onClick={async () => {
            //setShow('hidden');
            //close();
            //setActivityIndicatorAnimating(true);
            createRecord();
            //beginUpload();
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
            ? "creating record..."
            : "Add new customer"}
        </button>
      </div>
    </>
  );
};

export default CustomerView;
