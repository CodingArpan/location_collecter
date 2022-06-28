import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Refidgen from '../../Components/corporate/Refidgen';
import Navbar from '../../Components/common/Navbar';

import Verifylocation from '../../Components/corporate/Verifylocation';
import Profile from '../../Components/common/Profile';
import Generatelocreport from '../../Components/corporate/Generatelocdata';
import Employeedetails from '../../Components/corporate/Employeedetails';

export default function Admin() {
  const router = useRouter();
  const [Myprofile, setMyprofile] = useState(true)
  const [genref, setgenref] = useState(false)
  const [viewloc, setviewloc] = useState(false)
  const [generatelocreport, setgeneratelocreport] = useState(false)
  const [Employeelist, setEmployeelist] = useState(false)

  useEffect(() => {
    //  console.log(router.asPath)
    router.asPath.includes('?generaterefferal') ? setgenref(true) : setgenref(false)
    router.asPath.includes('?') ? setMyprofile(false) : setMyprofile(true)
    router.asPath.includes('?viewalllocation') ? setviewloc(true) : setviewloc(false)
    router.asPath.includes('?generatelocreport') ? setgeneratelocreport(true) : setgeneratelocreport(false)
    router.asPath.includes('?employeedetails') ? setEmployeelist(true) : setEmployeelist(false)

  }, [router])

  return (
    <>
      <div className="w-full h-max max-w-[500px] min-w-[300px] mx-auto py-2">

        <Navbar />
        {Myprofile && <Profile />}
        {genref && <Refidgen />}
        {viewloc && <Verifylocation />}
        {generatelocreport && <Generatelocreport />}
        {Employeelist && <Employeedetails />}

      </div>
    </>

  )

}
