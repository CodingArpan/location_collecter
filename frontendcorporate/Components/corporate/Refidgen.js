import React, { useState, useEffect, useRef } from 'react'
import Loader from '../common/Loader';

export default function Refidgen() {
    const ref = useRef()
    const [LoaderAnim, setLoaderAnim] = useState(false)

    const [Crpt, setCrpt] = useState(false)
    const [Mngr, setMngr] = useState(false)
    const [RegMngr, setRegMngr] = useState(false)
    const [Rpsv, setRpsv] = useState(false)

    useEffect(() => {
        try {
            const usertoken = document.cookie.split(';').find((coki) => {
                return coki.includes('usertoken')
            }).split('=')[1];
            const userdata = usertoken.split('.')[1];
            const actualdata = JSON.parse(atob(userdata))
            console.log(actualdata)

            if (actualdata.type === 'master') {
                setCrpt(true)
                setMngr(true)
                setRegMngr(true)
                setRpsv(true)


            } else if (actualdata.type === 'corporate') {
                setCrpt(false)
                setMngr(true)
                setRegMngr(true)
                setRpsv(true)

            } else if (actualdata.type === 'manager') {
                setCrpt(false)
                setMngr(false)
                setRegMngr(true)
                setRpsv(true)
            } else if (actualdata.type === 'regional_manager') {
                setCrpt(false)
                setMngr(false)
                setRegMngr(false)
                setRpsv(true)
            } else if (actualdata.type === 'representative') {
                setCrpt(false)
                setMngr(false)
                setRegMngr(false)
                setRpsv(false)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const [FullName, setFullName] = useState(true);
    const [Mail, setMail] = useState(true);
    const [Position, setPosition] = useState(true)

    const [Pass, setPass] = useState(true);

    const [SuccessRef, setSuccessRef] = useState(true);
    const [failedRef, setfailedRef] = useState(true);
    const [SuccessRefMsg, setSuccessRefMsg] = useState('');
    const [failedRefMsg, setfailedRefMsg] = useState('');
    const [ShowPass, setShowPass] = useState(false);
    const [refferals, setrefferals] = useState([{}])
    const [getRefList, setgetRefList] = useState(false)


    const refreshreffallist = async () => {

        setgetRefList(false);

        await fetch('http://localhost:4000/api/refferal/all', {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',

            },
            credentials: 'include',
            body: JSON.stringify({ status: false })

        }).then(async (response) => {
            const data = await response.json();
            // console.log(data);
            if (data.status && data.allrefferals.length > 0) {
                setrefferals(data.allrefferals)
                setgetRefList(true)

            } else {
                setrefferals()
                // console.log(data.message)
            }

        }).catch((error) => {
            // console.error('Error:', error.message);
        });

    }


    useEffect(async () => {

        refreshreffallist()

    }, [])

    const deletallmypendingrefferals = async () => {
        // e.preventDefault()
        // console.log('clicked')
        await fetch('http://localhost:4000/api/refferal/deletpendings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            credentials: 'include',
            body: JSON.stringify({ status: false })

        }).then(async (response) => {
            const data = await response.json();
            // console.log(data);
            refreshreffallist()

        }).catch((error) => {
            // console.error('Error:', error.message);


        });

    }



    // ----------------------------------------------------------------------------


    const [Refferalcreation, setRefferalcreation] = useState({

        creatorpwd: '',
        recipentname: '',
        recipenttype: '',
        recipentemail: ''

    })

    const generaterefferal = async (e) => {
        e.preventDefault()
        // console.log('clicked')
        setLoaderAnim(true)
        const validName = new RegExp('^[a-zA-Z ]+$').test(Refferalcreation.recipentname);
        const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(Refferalcreation.recipentemail);
        const validPosition = ['corporate', 'representative', 'regional_manager', 'manager'].includes(Refferalcreation.recipenttype);
        const validPassword = new RegExp('^[a-zA-Z0-9#%\+_-]+$').test(Refferalcreation.creatorpwd);


        validName ? setFullName(true) : setFullName(false);
        validEmail ? setMail(true) : setMail(false);
        validPosition ? setPosition(true) : setPosition(false);
        validPassword ? setPass(true) : setPass(false);

        if (validName &&
            validEmail && validPosition &&
            validPassword) {

            // console.log('sanditize')





            await fetch('http://localhost:4000/api/refferal/createnew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                credentials: 'include',
                body: JSON.stringify(Refferalcreation)

            }).then(async (response) => {
                const data = await response.json();
                // console.log(data);
                if (data.status) {
                    setSuccessRef(false)
                    setSuccessRefMsg(data.message)
                    setfailedRef(true)
                    setRefferalcreation({

                        creatorpwd: '',
                        recipentname: '',
                        recipenttype: '',
                        recipentemail: ''

                    })
                    refreshreffallist()
                    ref.current.click()
                } else {
                    setfailedRef(false)
                    setfailedRefMsg(data.message)
                    setSuccessRef(true)

                }
                setLoaderAnim(false)

            }).catch((error) => {
                // console.error('Error:', error.message);
                setLoaderAnim(false)
            });

        } else {
            // console.log('else')
            setLoaderAnim(false)
        }



    }

    const changedvalue = async (e) => {
        setRefferalcreation({ ...Refferalcreation, [e.target.name]: e.target.value.replace(/\s+/g, ' ').trim() })
    }

    return (
        <>
            {LoaderAnim && <Loader />}


            <div className="w-full h-max max-w-[500px] min-w-[300px] mx-auto my-3 mt-0 p-2">

                <form onSubmit={(e) => { generaterefferal(e) }} >

                    <div className="refferal bg-white rounded-xl drop-shadow-lg p-3 flex flex-col align justify-end">


                        <div className=" p-2">
                            <label htmlFor="recipentname" className="block mb-2 text-base font-normal text-blue-700 dark:text-blue-500">Issuing To</label>
                            <input type="text" maxLength={100} name="recipentname" id="recipentname" className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" placeholder="Recipent Name" onChange={(e) => { changedvalue(e) }} />
                        </div>
                        {!FullName && <p className="text-red-600 mx-3 text-sm ">Input Is Not A Name, Use Only A-Z, a-z</p>}

                        <div className=" p-2">
                            <label htmlFor="recipentemail" className="block mb-2 text-base font-normal text-blue-700 dark:text-blue-500">Send To</label>
                            <input type="email" name="recipentemail" id="recipentemail" className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" placeholder="Recipent Email" onChange={(e) => { changedvalue(e) }} />
                        </div>
                        {!Mail && <p className="text-red-600 mx-3 text-sm ">Input Is Not A Valid Email </p>}

                        <div className=" p-2">
                            <label htmlFor="recipenttype" className="block mb-2 text-base font-normal text-blue-700 dark:text-blue-500">Recipent Type</label>

                            <select className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" name="recipenttype" id="recipenttype" defaultValue={'DEFAULT'} required onChange={(e) => { changedvalue(e) }} >
                                <option className="m-5" value="DEFAULT" disabled >Select Recipent Type</option>
                                {Crpt && <option className="m-5" value="corporate" >Corporate</option>}
                                {Mngr && <option className="m-5" value="manager" >Manager</option>}
                                {RegMngr && <option className="m-5" value="regional_manager" >Regional Manager</option>}
                                {Rpsv && <option className="m-5" value="representative" >Representative</option>}
                            </select>
                        </div>
                        {!Position && <p className="text-red-600 mx-3 text-sm ">Please Select A Given Type</p>}

                        <div className="refid p-2">
                            <label htmlFor="creatorpwd" className="block mb-2 text-base font-normal text-blue-700 dark:text-blue-500">Your Password</label>
                            <input maxLength={20} className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" type={ShowPass ? 'text' : 'password'} name="creatorpwd" id="creatorpwd" placeholder="Your Password" onChange={(e) => { changedvalue(e) }} />
                        </div>
                        {!Pass && <p className="text-red-600 mx-3 text-sm ">Please Enter Your Valid Password</p>}
                        <div className="showhide w-fit py-3 inline-block">
                            <input className="mx-1 w-4 h-4" type="checkbox" name="showhide" id="showhide" onChange={() => { ShowPass ? setShowPass(false) : setShowPass(true) }} />

                            <label className="mx-1 text-lg" htmlFor="showhide">Show Password</label>
                        </div>

                        <div className="p-2">

                            {!failedRef && <p className="text-red-600 mx-3 text-sm break-words text-center">{failedRefMsg}</p>}
                            {!SuccessRef && <p className="text-green-600 mx-3 text-sm break-words text-center">{SuccessRefMsg}</p>}
                        </div>

                        <button type="submit" className="w-44 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-3 mx-auto">Create New Refferal</button>

                        <input type="reset" className="hidden" ref={ref} />

                    </div>
                </form>



                <div className="refferal bg-white rounded-xl drop-shadow-lg p-3 my-5 flex flex-col align justify-end">
                    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
                        <div className="bg-slate-600 w-full text-white text-left py-2 px-5 flex justify-between">
                            <span>All Refferals</span>
                            {getRefList && refferals.some((ref) => { return ref.status === false }) && <button type="button" className="bg-slate-800 py-1 px-3 rounded-md text-gray-400 text-xs cursor-pointer hover:text-rose-500" onClick={() => { deletallmypendingrefferals() }} >Delete All Pendings</button>}
                        </div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 h-max overflow-x-scroll">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="w-1/4 px-2 py-5 text-center">
                                        Refferal ID
                                    </th>
                                    <th className="w-3/4 px-2 py-5 text-center">
                                        Recipient Name
                                    </th>


                                </tr>
                            </thead>

                            <tbody className="w-full">
                                {!getRefList && <tr className="w-full text-2xl "><td colSpan={2} className="p-5 w-full text-center text-blue-500">No Pending Refferals To Show</td></tr>}

                                {
                                    getRefList && refferals.map((ref) => {

                                        return (<tr key={ref.recipentrefferalid + 1} className="border-b bg-white w-full">
                                            <td className={`w-1/4 px-2 py-4 font-medium text-center ${ref.status ? 'text-green-500' : 'text-red-500'} `}>
                                                {ref.recipentrefferalid}

                                            </td>
                                            <td className="w-3/4 max-w-[200px] px-2 py-4 text-left text-slate-400 break-words">

                                                <div className="py-1 max-w-full"> {ref.recipentname}</div>
                                                <hr className="border-slate-400" />
                                                <div className="py-1 max-w-full"> {ref.recipentemail}</div>
                                            </td>


                                        </tr>)
                                    })
                                }












                            </tbody>
                        </table>
                    </div>
                </div>














            </div >
        </>
    )

}
