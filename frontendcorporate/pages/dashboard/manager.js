import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Refidgen from '../../Components/corporate/Refidgen';
import Navbar from '../../Components/common/Navbar';
import TrackLocation from '../../Components/corporate/TrackLocation';

import Profile from '../../Components/common/Profile';
export default function Manager() {
    const router = useRouter();
    const [Myprofile, setMyprofile] = useState(true)
    const [subloc, setsubloc] = useState(false)
    const [genref, setgenref] = useState(false)
    const [viewloc, setviewloc] = useState(false)

    useEffect(() => {
        //  console.log(router.asPath)
        router.asPath.includes('?generaterefferal') ? setgenref(true) : setgenref(false)
        router.asPath.includes('?submitLocation') ? setsubloc(true) : setsubloc(false)
        router.asPath.includes('?') ? setMyprofile(false) : setMyprofile(true)

    }, [router])

    return (
        <>
            <div className="w-full h-max max-w-[500px] min-w-[300px] mx-auto py-2">

                <Navbar />
                {Myprofile && <Profile />}
                {genref && <Refidgen />}
                {subloc && <TrackLocation />}


            </div>
        </>

    )

}
