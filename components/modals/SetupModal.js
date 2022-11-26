import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCamera } from "@fortawesome/free-solid-svg-icons";
import Istyles from "../../styles/Inbox.module.css";
import styles from "../../styles/Signin.module.css";
import Slider from "react-slick";
import { useRef } from "react";
import { Logo, UploadImageIcon } from "../../components/icons";
import { Create, Invite } from "../../pages/api/organizationApi";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Router } from "next/router";
import Link from "next/link";

export default function SetupModal({ username }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [emails, setEmails] = useState([]);
  const [pictureURL, setPictureURL] = useState("");
  const [pictureFile, setPictureFile] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setisValid] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validExts = ["jpg", "jpeg", "png", "PNG"];
  const storage = getStorage();
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current?.click();
  };

  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
  };

  const sliderRef = useRef(null);

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };
  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      setPictureFile(event.target.files[0]);
      reader.onload = (e) => {
        setPictureURL(e.target.result);
        //this.setState({image: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const uploadImage = async (pictureURL, pictureFile) => {
    return new Promise(async (resolve, reject) => {
      let ext = pictureFile?.name?.split(".").pop();
      if (!validExts.includes(ext)) {
        reject({
          err: `Invalid file type of extension ${ext} supplied`,
          msg: "ERROR",
        });
      }

      try {
        let imgPath =
          "wakand-business/profile" +
          Math.floor(Math.random() * 8999999999999999 + 1000000000000000);
        +"." + ext;

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", pictureURL, true);
          xhr.send(null);
        });
        const imgRef = ref(storage, imgPath);
        let newPictureURL;
        uploadBytes(imgRef, blob).then(async (snapshot) => {
          newPictureURL = await getDownloadURL(imgRef);
          resolve({ newPictureURL, msg: "SUCCESS" });
        });
      } catch (err) {
        reject({ err: err.toString(), msg: "ERROR" });
      }
    });
  };

  const CreateOrganization = async () => {
    setLoading(true)
    let profileImg;
    if (pictureFile) {
      let profileUrl = await uploadImage(pictureURL, pictureFile);
      profileImg = profileUrl.newPictureURL;
     
    }

    if (!pictureURL) {
      const image = await fetch("https://picsum.photos/200")
      profileImg = image.url
    }

    try {
      let response = await Create(name, profileImg);
      let id = response?.data?.data?.id;
      await Invite(emails, id);
      nextSlide()
      if (response.data.msg === "SUCCESS") {
        setDone(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <div
        className="w-screen h-screen bg-[#707070] font-body absolute p-6 top-0 backdrop flex justify-center items-center"
        onClick={() => setShowModal(false)}
      >
        <div className=" flex h-full w-full bg-white mx-auto z-50 rounded-lg md:w-2/3 md:h-5/6">
          <div className=" w-full md:w-9/12 h-full py-5">
            {/* Header Logo */}
            <div className="md:mb-[3rem] pl-5 pt-3">
              <Image src="/logo.png" width="177px" height="40px" />
            </div>

            <div className="w-11/12 md:w-9/12 mx-auto py-4">
              {/* Slider goes here */}
              <Slider ref={sliderRef} {...settings}>
                <div>
                  <h1 className="text-center md:text-left text-[#163828] font-semibold text-[1.2rem] md:text-[1.5rem] ">
                    Set Up Your Workstation
                  </h1>

                  <div className="my-[3rem] font-normal text-lg text-center md:text-left md:text-lg sm:text-md text-[#163828] py-1 ">
                    <p className="">
                      Welcome,{" "}
                      <span className="text-[#00A85A] font-bold">
                        {username || "User"}
                      </span>{" "}
                    </p>
                    <p className="">Let’s get you started for productivity</p>
                    <p className=" ">This will only take a minute</p>
                  </div>

                  <div className="my-[2em] cursor-pointer" onClick={nextSlide}>
                    <p className="block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#18A75D4D]">
                      START
                    </p>
                  </div>
                </div>

                {/* Slide 2 Start */}

                <div className="w-11/12 mx-auto">
                  <div className="relative h-full">
                    <h1 className="text-center md:text-left text-[#163828] font-semibold text-[1.2rem] md:text-[1.5rem] ">
                      Name Your Workstation
                    </h1>

                    <div className="my-[2rem]">
                      <input
                        type="text"
                        placeholder="Type your workstation name here"
                        minLength={3}
                        className="placeholder:text-sm placeholder-[#87AC9B] placeholder:font-normal	font-semibold text-[#163828] outline-0 text-sm w-full px-3 py-3 md:py-5 border border-[#87AC9B] rounded-2xl bg-[#EFF7F0]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {error && (
                        <span className="text-red-700 text-xs">
                          {errorMessage}
                        </span>
                      )}
                      <p className="font-medium text-[0.8rem] text-center md:text-left  md:text-sm  sm:text-md text-[#648B7A] my-4">
                        You can use the name of your company or organization
                      </p>
                    </div>

                    {/* Next Arrow start */}
                    <div
                      className="my-[2em] cursor-pointer"
                      onClick={() => {
                        if (name.length <= 3) {
                          setError(true);
                          setErrorMessage(
                            "Workstation name should have at least four letters."
                          );
                          setisValid(false);
                          return;
                        } else {
                          nextSlide();
                          setError(false);
                          return;
                        }
                      }}
                    >
                      <p className="block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#00A85A]/50 ">
                        NEXT
                      </p>
                    </div>
                    {/* Next Arrow end */}
                  </div>

                  {/* Previous Arrow ALTERNATE - Start */}
                  <div className="absolute bottom-0">
                    <div className="flex justify-between relative md:bottom-5 md:-right-[25em]">
                      <div></div>
                      <div className="flex cursor-pointer" onClick={prevSlide}>
                        <svg
                          className="bg-[#87AC9B29] rounded-md w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>

                        <span className="font-bold text-[0.8rem] ml-2">
                          PREV
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Previous Arrow - End */}
                </div>

                {/* Slide 2 ends here */}

                <div className="h-full w-11/12 mx-auto">
                  <div className="relative h-full">
                    <h1 className="text-center md:text-left text-[#163828] font-semibold  text-[1.2rem] md:text-[1.5rem] ">
                      Invite People to Your Workstation
                    </h1>

                    <div className="my-[1rem] text-[0.8rem] md:text-lg sm:text-md">
                      <input
                        type="text"
                        placeholder="Enter Emails here (or paste multiple emails)"
                        className="placeholder:text-sm placeholder-[#87AC9B] placeholder:font-normal	font-semibold outline-0 w-full px-3 py-3 md:py-5 border border-[#87AC9B] rounded-2xl bg-[#EFF7F0]"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      />
                      <p className="font-medium text-[#648B7A]  text-center md:text-left text-sm my-4">
                        Separate multiple emails with comma (,)
                      </p>
                    </div>

                    {/* Next Arrow start */}
                    <div
                      className="my-[2em] cursor-pointer"
                      onClick={nextSlide}
                    >
                      <p className="block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#18A75D4D]">
                        NEXT
                      </p>
                    </div>
                    {/* Next Arrow end */}
                  </div>

                  {/* Previous Arrow ALTERNATE - Start */}
                  <div className="absolute bottom-0">
                    <div className="flex justify-between relative md:bottom-5 md:-right-[25em]">
                      <div></div>
                      <div className="flex cursor-pointer" onClick={prevSlide}>
                        <svg
                          className="bg-[#87AC9B29] rounded-md w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>

                        <span className="font-bold text-[0.8rem] ml-2">
                          PREV
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Previous Arrow - End */}
                </div>

                {/* Slide 4? start */}

                <div className="h-full w-11/12 mx-auto">
                  <h1 className="text-center md:text-left text-[#163828] font-semibold text-[1.2rem] md:text-[1.8rem] ">
                    Customize Your Avatar
                  </h1>

                  <div className="py-8">
                    <div className="flex">
                      <input
                        type="file"
                        id="file"
                        ref={inputFile}
                        style={{ display: "none" }}
                        onChange={onImageChange}
                      />
                      <div
                        className={`bg-[#eff7f0] h-36 w-36 text-[#87ac9b] border border-[#d2e8d6]  rounded-xl flex flex-col justify-center items-center cursor-pointer`}
                        onClick={onButtonClick}
                      >
                        {pictureURL && (
                          <Image
                            alt="logo"
                            width={120}
                            height={120}
                            className={`  object-cover rounded-lg grow-0`}
                            src={pictureURL}
                            onClick={onButtonClick}
                          />
                        )}
                        {!pictureURL && <UploadImageIcon />}
                        {!pictureURL && (
                          <div className="text-center text-sm">
                            Upload Image
                          </div>
                        )}
                      </div>

                      {/* Or */}
                      {/* <div className="border-r-[#87AC9B] border-r-[0.12rem] h-24 py-8 z-20 relative m-auto"></div>
                      <div className="hidden bg-white absolute mt-[2.1rem] ml-[-5rem] z-30 text-[#163828] text-[1.5rem] pt-2 lg:block">
                        Or
                      </div>

                      <button
                        type="input"
                        className=" mr-auto px-8 py-2 bg-[#A9D046] text-center  rounded-2xl focus:border ml-2"
                      >
                        <p className="text-white text-[4rem] font-black"></p>
                      </button> */}
                    </div>

                    {/* Next Arrow start */}
                    <div
                      className="my-[2em] cursor-pointer"
                    >
                      <button
                        onClick={async () => {
                          await CreateOrganization()
                        }}
                        className="block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#18A75D4D]"
                      >{loading ?
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className={`${styles["spinner"]}`}
                          style={{
                            fontSize: 30,
                            color: "#fff",
                          }}
                        /> : 'NEXT'}
                      </button>
                    </div>
                    {/* Next Arrow end */}

                    {/* Previous Arrow ALTERNATE - Start */}
                    <div className="absolute bottom-0">
                      <div className="flex justify-between relative md:bottom-5 md:-right-[25em]">
                        <div></div>
                        <div
                          className="flex cursor-pointer"
                          onClick={prevSlide}
                        >
                          <svg
                            className="bg-[#87AC9B29] rounded-md w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                          </svg>

                          <span className="font-bold text-[0.8rem] ml-2">
                            PREV
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Previous Arrow - End */}
                  </div>
                </div>

                {/* Slide 4? Ends */}

                {/* Slide 8? start */}

                <div className="h-full w-11/12 mx-auto">
                  <h1 className="text-center md:text-left text-[#163828] font-bold text-[1.2rem] md:text-[1.8rem] ">
                    That's It.
                  </h1>

                  <div className="my-[4rem] font-medium text-lg text-center md:text-left md:text-lg  sm:text-md text-[#163828] py-1">
                    <p className="font-medium tracking-wider">
                      Congratulations,{" "}
                      <span className="text-[#00A85A] font-bold">{name}</span>{" "}
                    </p>
                    <p className="">Now go and Have fun and be</p>
                    <p className="">productive</p>
                  </div>

                  <div className="my-[4em] cursor-pointer" onClick={nextSlide}>
                    {/* <Link href='/'> <button  className="block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#18A75D4D]">  
                       LET'S GO
                      </button></Link> */}

                    {!done && <button className=" block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-gray-300 md:text-base  sm:text-md "> WAIT</button>}

                    {done && <Link href={"/"}>
                      <button className=" block md:inline text-[0.8rem] mx-auto text-center py-3 px-8 rounded-lg text-white font-medium  bg-[#00A85A] md:text-base  sm:text-md shadow-lg shadow-[#18A75D4D]"> LET'S GO</button>
                    </Link>}
                  </div>

                  {/* Previous Arrow ALTERNATE - Start */}
                  <div className="absolute bottom-0">
                    <div className="flex justify-between relative md:bottom-5 md:-right-[25em] z-50">
                      <div></div>
                      <div className="flex cursor-pointer" onClick={prevSlide}>
                        <svg
                          className="bg-[#87AC9B29] rounded-md w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>

                        <span className="font-bold text-[0.8rem] ml-2">
                          PREV
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Previous Arrow - End */}
                </div>

                {/* Slide 8? ends */}
              </Slider>
            </div>
          </div>

          <div className="hidden md:block h-full w-3/12 bg-[#00A85A] bg-[url('/Group 1282.svg')] bg-cover bg-no-repeat rounded-r-lg">
            <Logo className="w-full h-full rounded-r-lg" />
          </div>
        </div>
      </div>
    </>
  );
}
