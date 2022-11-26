import { useState } from "react";
import "firebase/firestore";
import Image from "next/image";
import HeadComp from "../../components/Head";
import Signincard from "../../components/form/Signincard";
import styles from "../../styles/Signin.module.css";

export default function SigninIndex({}) {
  return (
    <div>
      <HeadComp />
      {/* <Navbar2 /> */}
      <div className=" flex sm:justify-start md:justify-start md:ml-56 xs:ml-24  mt-8 items-center ">
              <Image
                alt="logo"
                width={50}
                height={40}
                className="object-contain h-20 w-20  grow-0"
                src={require("../../assets/W2021.ab423404.png")}
              />
              <h2 className="text-[#00A85A] text-lg  tracking-wide font-sans font-bold">
                Wakanda&nbsp;
                <span className="font-normal font-sans ">CRM</span>
              </h2>
            </div>
      <div className="min-h-screen flex  justify-center">
        <div className="grid xs:grid-cols-1 lg:md:grid-cols-5 ">
          <div className="col-span-1 lg:md:col-span-2 lg:w-8/12 md:w-9/12 sm:w-6/12 mx-auto mt-24  ">
            <Signincard />
          </div>
          <div className="col-span-1 lg:md:col-span-3 w-full px-8 mb-16 lg:px-0">
            <div className="w-full flex sm:xs:items-center lg:md:justify-start lg:md:items-start flex-col">
              <div className="w-9/12 md:ml-12">
                <Image
                  alt="logo"
                  width={684}
                  height={588}
                  className="object-contain rounded-lg w-full transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-105  duration-300 "
                  src={require("../../assets/splash-banner.png")}
                />
              </div>
              <div className="relative w-10/12  xs:ml-8 ml-12 flex flex-row">
                <p
                  className={`text-5xl font-bold text-left  ${styles["banner-text1"]}`}
                >
                  Manage Your <br />
                  Business{" "}
                  <span
                    className={`relative mt-12 text-5xl italic font-normal  ${styles["banner-text2"]}`}
                  >
                    <span className=" z-[100px]">Seamlessly</span>
                    <div
                      className={`absolute bottom-4 left-0 opacity-60 h-3 w-60 z-[-100px] ${styles["line-through"]}`}
                    ></div>
                  </span>
                </p>
              </div>
              <div className="w-10/12 mt-4  xs:ml-8 ml-12">
                <p
                  className={`text-base font-base text-left  ${styles["banner-text3"]}`}
                >
                  <span className="font-bold">Wakanda CRM</span> gives you the
                  Best tools to achieve optimum <br />
                  efficiency in your business.
                </p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
