import Link from "next/link";
import Image from "next/image";

import styles from "../styles/Menu.module.css";

function SideMenuMobile({menuSelect}) {
  return (
    <div className={`flex flex-col  `}>
       <Link href={"/workstation"}>
        <button
          className={`${
            menuSelect == "/workstation"
              ? "text-[#00A85A] bg-white  font-bold border border-[#00A85A] "
              : "text-[#87AC9B] "
          } mb-4 hover:ring-1 dark:hover:ring-[#648B7A]  transition-color hover:bg-transparent duration-200  rounded-lg text-sm   inline-flex items-start gap-2 pl-3 pr-6 pt-2 pb-2   `}
        >
          <Image
            src={
              menuSelect == "/workstation"
                ? "/icons/WorkstationClicked.svg"
                : "/icons/Workstation.svg"
            }
            alt="Wakanda"
            width={20}
            height={20}
          />
          Workstation
        </button>
      </Link>

      <Link href={"/task"}>
        <button
          className={`${
            menuSelect == "/task"
              ? "text-[#00A85A] bg-white  font-bold border border-[#00A85A] "
              : "text-[#87AC9B] "
          } mb-4 hover:ring-1 dark:hover:ring-[#648B7A]  transition-color hover:bg-transparent duration-200  rounded-lg text-sm   inline-flex items-start gap-2 pl-3 pr-6 pt-2 pb-2   `}
        >
          <Image
            src={
              menuSelect == "/task"
                ? "/icons/TaskClicked.svg"
                : "/icons/Task.svg"
            }
            alt="Wakanda"
            width={20}
            height={20}
          />
          Tasks
        </button>
      </Link>

      <Link href={"/reminders"}>
        <button
          type="button"
          className={`${
            menuSelect == "/reminders"
              ? "text-[#00A85A] bg-white  font-bold border border-[#00A85A] "
              : "text-[#87AC9B] "
          } mb-4 hover:ring-1 dark:hover:ring-[#648B7A]  transition-color hover:bg-transparent  duration-200   rounded-lg text-sm   inline-flex items-start gap-2 pl-3 pr-6 pt-2 pb-2   `}
        >
          <Image
            src={
              menuSelect == "/reminders"
                ? "/icons/RemindersClicked.svg"
                : "/icons/Reminders.svg"
            }
            alt="Wakanda"
            width={20}
            height={20}
          />
          Reminders
        </button>
      </Link>

      <Link href={"/customers"}>
        <button
          type="button"
          className={`${
            menuSelect == "/customers"
              ? "text-[#00A85A] bg-white  font-bold border border-[#00A85A] "
              : "text-[#87AC9B] "
          } mb-4 hover:ring-1 dark:hover:ring-[#648B7A] transition-color hover:bg-transparent duration-200  rounded-lg text-sm   inline-flex items-start gap-2 pl-3 pr-6 pt-2 pb-2   `}
        >
          <Image
            src={
              menuSelect == "/customers"
                ? "/icons/CustomersClicked.svg"
                : "/icons/Customers.svg"
            }
            alt="Wakanda"
            width={20}
            height={20}
          />
          Customers
        </button>
      </Link>

      <div className={`${styles["footer-bar"]} rounded-lg`}></div>
    </div>
  );
}

export default SideMenuMobile;
