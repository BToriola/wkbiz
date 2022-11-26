import React from 'react'
import SetupModal from '../../components/modals/SetupModal'
import { useSelector, useDispatch } from "react-redux";



const Setup = () => {
  const user = useSelector((state) => state?.user?.user)
  let userName = user?.profileData?.name || ''
  return (
    <>
      <SetupModal username={userName} />
    </>
  )
}

export default Setup
