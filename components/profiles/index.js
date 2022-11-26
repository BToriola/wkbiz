import React, { useEffect, useState } from "react";

export default function Profiles({profileID}) {
  return (
    <>
      <ul className="list-none py-2 bg-[#EFF7F0] rounded-lg p-3 my-2 text-gray-400 text-sm border-1 border-[#00A85A]">
        <li className="border-b-[1px] border-gray-200 py-1 hover:text-green-600">
          Assignee 1
        </li>
        <li className="border-b-[1px] border-gray-200 py-1 hover:text-green-600">
          Assignee 2
        </li>
        <li className="hover:text-green-600">Assignee 3</li>
      </ul>
    </>
  );
}
