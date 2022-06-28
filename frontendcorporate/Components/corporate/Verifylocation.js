import React, { useState, useEffect } from 'react'
import Loader from '../common/Loader';


export default function Verifylocation() {
    const [Myid, setMyid] = useState()
    const [LoaderAnim, setLoaderAnim] = useState(false)

    const [Error, setError] = useState(false)
    const [verifieriderror, setverifieriderror] = useState(false)
    const [Success, setSuccess] = useState(false)
    const [Errormsg, setErrormsg] = useState('')
    const [Successmsg, setSuccessmsg] = useState('')

    const [ReqLoc, setReqLoc] = useState()
    const [Forfilter, setForfilter] = useState()
    const [ReqLocstatus, setReqLocstatus] = useState(false)

    const requestLochistory = async (qdate) => {
        // console.log(qdate)
        setLoaderAnim(true)
        if (qdate === undefined) {
            qdate = new Date()
        }
        // console.log(qdate)
        const reqdate = new Date(qdate)
        const date = reqdate.getDate()
        const month = reqdate.getMonth() + 1
        const year = reqdate.getFullYear()


        const url = `http://localhost:4000/api/location/allloc/${date}/${month}/${year}`;

        await fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(async (response) => {

            const data = await response.json();
            // console.log(data)

            if (data.status) {
                if (data.data.length > 0) {
                    setReqLoc(data.data)
                    setForfilter(data.data)
                    setReqLocstatus(true)
                } else {
                    setReqLocstatus(false)
                }


            } else {

            }
            setLoaderAnim(false)

        }).catch(async (err) => {

            setLoaderAnim(false)
        })


    }

    const locationfilterbyname = async (name) => {

        // console.log(name)
        // console.log(ReqLoc)
        // console.log(Forfilter)

        if (name !== '' && Forfilter !== undefined && Forfilter.length > 0) {

            const filterbyname = Forfilter.filter((item) => {
                return item.name.includes(name)
            })
            setReqLoc(filterbyname)
            filterbyname.length === 0 ? setReqLocstatus(false) : setReqLocstatus(true)

        }
    }

    const locationfilterbylevel = async (level) => {
        // console.log(level)
        // console.log(ReqLoc)
        // console.log(Forfilter)

        if (level !== '' && Forfilter !== undefined && Forfilter.length > 0) {

            const filterbyname = Forfilter.filter((item) => {
                return item.position === level
            })
            setReqLoc(filterbyname)
            filterbyname.length === 0 ? setReqLocstatus(false) : setReqLocstatus(true)
        }


    }

    useEffect(() => {
        requestLochistory()
        const accdetail = JSON.parse(localStorage.getItem('profile'))
        setMyid(accdetail)
        // console.log(accdetail)

    }, [])

    const closestatusmsg = () => {
        setError(false)
        setSuccess(false)
    }

    const verifylocation = async (locid, myid) => {
        setLoaderAnim(true)
        // console.log(locid, myid)

        if (myid === Myid.refferalid) {


            const url = `http://localhost:4000/api/location/verify/${locid}/${myid}`

            await fetch(url, {
                method: 'GET',
                credentials: 'include',

            }).then(async (response) => {
                const data = await response.json();
                // console.log(data)

                if (data.status) {
                    setSuccess(true)
                    setSuccessmsg(data.message)
                    setTimeout(() => {
                        setSuccess(false)
                    }, 5000);
                    setverifieriderror(false)





                } else {
                    setError(true)
                    setErrormsg(data.message)
                    setTimeout(() => {
                        setError(false)
                    }, 5000);
                }
                setLoaderAnim(false)
            }).catch((error) => {
                // console.log(error)
                setLoaderAnim(false)
            })


        } else {
            setverifieriderror(true)
            setLoaderAnim(false)
        }




    }

    return (
        <>
            {LoaderAnim && <Loader />}

            <div className="w-full h-max p-2">

                <div className="bg-white w-full h-max shadow-lg rounded-lg ">

                    <div className="flex flex-col p-2">
                        <label htmlFor="locdate" className="text-sm text-gray-800 my-1">Choose Date</label>
                        <input className="pb-2 w-full text-lg bg-transparent outline-none font-medium text-gray-700 mx-auto border border-gray-400 rounded-lg  p-1" type="date" name="locdate" id="locdate" placeholder="Choose Date" format="dd-mm-yyyy" onChange={(e) => { requestLochistory(e.target.value) }} />
                    </div>

                    <div className="w-full bg-slate-700 p-3 flex flex-col-reverse justify-evenly rounded-lg">


                        <input className="w-full p-2 my-1  bg-white font-normal text-black rounded-lg" type="search" name="searchbyname" id="searchbyname" placeholder="Search By Name" onChange={(e) => { locationfilterbyname(e.target.value.trim()) }} />


                        <select className="w-full rounded-lg p-2 my-1 " name="usertype" id="usertype" defaultValue={'DEFAULT'} required onChange={(e) => { locationfilterbylevel(e.target.value.trim()) }} >
                            <option className="m-5" value="DEFAULT" disabled >Level</option>
                            <option className="m-5" value="corporate">Corporate</option>
                            <option className="m-5" value="representative">Representative</option>
                            <option className="m-5" value="regional_manager">Regional Manager</option>
                            <option className="m-5" value="manager">Manager</option>
                        </select>

                    </div>

                    <div className="w-full p-2">

                        {ReqLocstatus && ReqLoc.map((val) => {
                            return <div key={val._id} className="relative block  rounded-lg mb-3 border border-slate-500">

                                <iframe className="object-cover w-full h-72" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-ZiVsfySCG4Ck0KuHMqUfOTWUilM1ICc&q=${val.latitude},${val.longitude}&zoom=19&maptype=roadmap`}>
                                </iframe>

                                <div className="p-3 bg-gray-900">
                                    <p className="text-xs text-gray-500">


                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">latitude : {val.latitude}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Longitude : {val.longitude}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Date : {val.date}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Time : {val.time}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Name : {val.name}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Position : {val.position.replace('_', ' ')}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Accuracy : <span className={val.locationaccuracy > 100 ? 'text-red-500' : 'text-green-500'}>{parseInt(val.locationaccuracy)}</span></span>



                                        {val.verifyby.length > 0 && <>

                                            <div className="peer w-max h-max bg-slate-700/75  rounded-lg shadow-xl p-1" >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256-.0078C260.7-.0081 265.2 1.008 269.4 2.913L457.7 82.79C479.7 92.12 496.2 113.8 496 139.1C495.5 239.2 454.7 420.7 282.4 503.2C265.7 511.1 246.3 511.1 229.6 503.2C57.25 420.7 16.49 239.2 15.1 139.1C15.87 113.8 32.32 92.12 54.3 82.79L242.7 2.913C246.8 1.008 251.4-.0081 256-.0078V-.0078zM256 444.8C393.1 378 431.1 230.1 432 141.4L256 66.77L256 444.8z" fill='#339cff' /></svg>
                                            </div>

                                            <div className="w-max h-max flex flex-col p-2 bg-slate-800 rounded-b-lg rounded-tr-lg my-2 absolute border border-blue-800 opacity-0 peer-hover:opacity-100 z-50">

                                                {val.verifyby.map((item, id) => {
                                                    return <span key={id} className="p-1 text-slate-300 shadow-2xl tracking-wider">✅ {item.split('+')[0].toUpperCase()} </span>
                                                })}

                                            </div>
                                        </>
                                        }




                                    </p>

                                    <h5 className="text-sm text-white py-1 break-normal">{val.purpose}</h5>

                                    <p className=" text-xs text-gray-500 break-normal">{val.message}</p>
                                </div>

                                {!val.verifyby.some((item) => {
                                    return item.includes(Myid.fullname && Myid.refferalid)
                                }) &&
                                    <>
                                        <input className="peer hidden" type="checkbox" name="veriryloc" id={val._id} />

                                        <div className="w-max h-max bg-slate-700 backdrop-blur-md absolute bottom-14 right-2 rounded-lg shadow-xl hidden  peer-checked:block p-3 ">

                                            <form onSubmit={(e) => { e.preventDefault(); verifylocation(val._id, e.target[0].value) }} >
                                                <input maxLength={5} minLength={5} className="w-full  text-center p-2 rounded-lg bg-transparent outline outline-offset-0 outline-gray-500 text-slate-300" type="text" name="myid" id="myid" required placeholder="Your ID" />

                                                {verifieriderror && <p className="text-rose-500 text-sm my-2">Don't Looks Like Your ID, Check Again</p>}
                                                <div>

                                                    <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2  my-3 w-full">Verify</button>
                                                </div>
                                            </form>

                                        </div>

                                        <label htmlFor={val._id} className="w-10 h-10 bg-slate-700/75 absolute bottom-2 right-2 rounded-lg shadow-xl">
                                            <svg className="w-10 h-10 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360C94.93 360 120 385.1 120 416C120 446.9 94.93 472 64 472C33.07 472 8 446.9 8 416C8 385.1 33.07 360 64 360zM64 200C94.93 200 120 225.1 120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200zM64 152C33.07 152 8 126.9 8 96C8 65.07 33.07 40 64 40C94.93 40 120 65.07 120 96C120 126.9 94.93 152 64 152z" fill="#cfcfcf" /></svg>
                                        </label>

                                    </>
                                }











                            </div>
                        })
                        }

                        {!ReqLocstatus && <h2 className="text-2xl text-center text-indigo-600 py-16">No Data Available To Show</h2>}



                    </div>

                </div>

            </div>


            {Error && <div id="alert-border-2" className="w-full float-left left-0 top-0 z-50 fixed flex p-4 mb-4 bg-red-100 border-t-4 border-red-500 dark:bg-red-200" role="alert">
                <svg className="flex-shrink-0 w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <div className="ml-3 text-sm font-medium text-red-700">
                    {Errormsg}
                </div>
                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-100 dark:bg-red-200 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 dark:hover:bg-red-300 inline-flex h-8 w-8" data-dismiss-target="#alert-border-2" aria-label="Close" onClick={() => { closestatusmsg() }}>
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>}

            {Success && <div id="alert-border-3" className="w-full float-left left-0 top-0 z-50 fixed  flex p-4 mb-4 bg-green-100 border-t-4 border-green-500 dark:bg-green-200" role="alert">
                <svg className="flex-shrink-0 w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <div className="ml-3 text-sm font-medium text-green-700">
                    {Successmsg}
                </div>
                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-green-100 dark:bg-green-200 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 dark:hover:bg-green-300 inline-flex h-8 w-8" data-dismiss-target="#alert-border-3" aria-label="Close" onClick={() => { closestatusmsg() }}>
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
            }

        </>
    )

}

