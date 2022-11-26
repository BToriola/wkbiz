// import React, { useState } from "react";
// import { useEffect } from "react";
// import Invite from "../../components/Invite";
// import { myInvites } from "../api/organizationApi";

// export default function Introduction() {
//   const invites = [
//     {
//       email: "bamtaiwo9@gmail.com",
//       inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
//       organizationID: "iSQ0IAKFN6Dfo4i99E8H",
//       status: "OPEN",
//       timeCreated: new Date(),
//       inviterImg: "/Group 794.png",
//       inviter: "Biodun Makinde",
//       teamImg: "/Group 794.png",
//       team: "Google Team",
//     },
//     {
//       email: "bamtaiwo9@gmail.com",
//       inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
//       organizationID: "iSQ0IAKFN6Dfo4i99E8H",
//       status: "OPEN",
//       timeCreated: new Date(),
//       inviterImg: "/Group 794.png",
//       inviter: "Sandra Oghenerukevwe",
//       teamImg: "/Group 794.png",
//       team: "Sandrallili international",
//     },
//     {
//       email: "bamtaiwo9@gmail.com",
//       inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
//       organizationID: "iSQ0IAKFN6Dfo4i99E8H",
//       status: "OPEN",
//       timeCreated: new Date(),
//       inviterImg: "/Group 794.png",
//       inviter: "Bolaji Dauda",
//       teamImg: "/Group 794.png",
//       team: "Wakanda Team",
//     },
//   ];

//   const [searchInput, setSearchInput] = useState("");
//   const [showInvite, setShowInvite] = useState(true);

//   useEffect(async () => {
//     const invites = await myInvites();
//   }, []);

//   return (
//     <>
//       <div className="">
//         <div
//           className="w-screen h-screen  bg-slate-200 absolute top-0 z-10 "
//           onClick={() => {
//             setShowInvite(false);
//           }}
//         ></div>

//         <div className="absolute bg-white w-11/12 md:w-8/12 h-5/6 z-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3 md:p-6 rounded-3xl">
//           <div className="w-11/12 mx-auto overflow-hidden">
//             <p
//               className="inline rounded-full py-2 px-4  absolute top-[-2%] right-[-1%] z-40 font-bold text-xl bg-[#648B7A] text-white  border-4 border-white"
//               onClick={() => {
//                 setShowInvite(false);
//               }}
//             >
//               X
//             </p>
//             <div>
//             <h1 className="text-center md:text-left text-[#163828] font-bold text-[1rem] md:text-[1.3rem]">
//                 Invites Received
//               </h1>
//             </div>

//             <div className="p-2">
//               <div className="w-full my-2">
//                 <input
//                   onChange={(e) => {
//                     setSearchInput(e.target.value);
//                     const filteredData = [];
//                   }}
//                   type="text"
//                   placeholder='Search for "Invitee Name" or a "Team Name"'
//                   className="w-full border border-[#87AC9B] p-3 rounded-xl"
//                 />
//               </div>

//               <p className="font-bold">{invites?.length} Invites</p>

//               <div className="">
//                 {/* {invites.map((invite) => {
//                   return (
//                     <Invite invite={invite} />
//                   )
//                 })} */}

//                 {invites
//                   .filter((invite) => {
//                     if (searchInput == "") {
//                       return invite;
//                     } else if (
//                       invite.inviter
//                         .toLowerCase()
//                         .includes(searchInput.toLowerCase())
//                     ) {
//                       return invite;
//                     }
//                   })
//                   .map((invite) => {
//                     return <Invite invitation={invite} />;
//                   })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



import React, { useState } from "react";
import { useEffect } from "react";
import Invite from "../../components/Invite";
import { myInvites } from "../api/organizationApi";

export default function Introduction() {
  const [_invites, set_invites] = useState(null);
  // const invites = [
  //   {
  //     email: "bamtaiwo9@gmail.com",
  //     inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
  //     organizationID: "iSQ0IAKFN6Dfo4i99E8H",
  //     status: "OPEN",
  //     timeCreated: new Date(),
  //     inviterImg: "/Group 794.png",
  //     inviter: "Biodun Makinde",
  //     teamImg: "/Group 794.png",
  //     team: "Google Team",
  //   },
  //   {
  //     email: "bamtaiwo9@gmail.com",
  //     inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
  //     organizationID: "iSQ0IAKFN6Dfo4i99E8H",
  //     status: "OPEN",
  //     timeCreated: new Date(),
  //     inviterImg: "/Group 794.png",
  //     inviter: "Sandra Oghenerukevwe",
  //     teamImg: "/Group 794.png",
  //     team: "Sandrallili international",
  //   },
  //   {
  //     email: "bamtaiwo9@gmail.com",
  //     inviterProfileID: "nzXRLfep5BRjL2WeBdIwX5AHFJ02",
  //     organizationID: "iSQ0IAKFN6Dfo4i99E8H",
  //     status: "OPEN",
  //     timeCreated: new Date(),
  //     inviterImg: "/Group 794.png",
  //     inviter: "Bolaji Dauda",
  //     teamImg: "/Group 794.png",
  //     team: "Wakanda Team",
  //   },
  // ];

  const [searchInput, setSearchInput] = useState("");
  const [showInvite, setShowInvite] = useState(true);

  useEffect(async () => {
    const invites = await myInvites();
    set_invites(invites.data.invitations);
  }, []);

  return (
    <>
      <div className="">
        <div
          className="w-screen h-screen  bg-slate-200 absolute top-0 z-10 "
          onClick={() => {
            setShowInvite(false);
          }}
        ></div>

        <div className="absolute bg-white w-11/12 md:w-8/12 h-5/6 z-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3 md:p-6 rounded-3xl">
          <div className="w-11/12 mx-auto overflow-hidden">
            <p
              className="inline rounded-full py-2 px-4  absolute top-[-2%] right-[-1%] z-40 font-bold text-xl bg-[#648B7A] text-white  border-4 border-white"
              onClick={() => {
                setShowInvite(false);
              }}
            >
              X
            </p>
            <div>
            <h1 className="text-center md:text-left text-[#163828] font-bold text-[1rem] md:text-[1.3rem]">
                Invites Received
              </h1>
            </div>

            <div className="p-2">
              <div className="w-full my-2">
                <input
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    const filteredData = [];
                  }}
                  type="text"
                  placeholder='Search for "Invitee Name" or a "Team Name"'
                  className="w-full border border-[#87AC9B] p-3 rounded-xl"
                />
              </div>

              <p className="font-bold">{_invites?.length} Invites</p>

              <div className="">
                {/* {invites.map((invite) => {
                  return (
                    <Invite invite={invite} />
                  )
                })} */}

                {_invites
                  ?.filter((invite) => {
                    if (searchInput == "") {
                      return invite;
                    } else if (
                      invite.inviter
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    ) {
                      return invite; 
                    }
                  })
                  .map((invite) => {
                    return <Invite invitation={invite} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

