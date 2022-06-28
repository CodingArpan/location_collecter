import React, { useState, useEffect, useRef } from 'react'
import Loader from '../common/Loader';


export default function TrackLocation() {
    const [LoaderAnim, setLoaderAnim] = useState(false)

    const [Latitude, setLatitude] = useState(0.0)
    const [Longitude, setLongitude] = useState(0.0)
    const [Getlocation, setGetlocation] = useState(false)
    const [Error, setError] = useState(false)
    const [Errormsg, setErrormsg] = useState('')
    const [Success, setSuccess] = useState(false)
    const [Successmsg, setSuccessmsg] = useState('')
    const [fetchinglocation, setfetchinglocation] = useState(false)
    const [ReqLoc, setReqLoc] = useState()
    const [ReqLocstatus, setReqLocstatus] = useState(false)

    const ref = useRef()

    const [Locationform, setLocationform] = useState({
        latitude: '',
        longitude: '',
        locationaccuracy: '',
        purpose: '',
        message: ''

    })

    const getLocation = async () => {
        setfetchinglocation(true)
        //  console.log('first')
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
            enableHighAccuracy: true,
            timeout: 10000
        });

    }

    const locationSuccess = (position) => {
        //  console.log(position.coords)
        setLocationform({ ...Locationform, latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString(), locationaccuracy: position.coords.accuracy.toString() })
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setGetlocation(true)
        setfetchinglocation(false)


    }

    const locationError = (err) => {
        //  console.log(err)
        setError(true)
        setErrormsg(`Please give us permission to access your current location, it will not track you forever.Turn on your location or Go to settings > Location > Turn On`)
        setfetchinglocation(false)


    }

    const [Purpose, setPurpose] = useState(true)
    const [Message, setMessage] = useState(true)

    const submitLocation = async (e) => {
        setLoaderAnim(true)
        e.preventDefault();
        const validPurpose = new RegExp('^[a-zA-Z0-9\.\,\\ ]+$').test(Locationform.purpose);
        const validMessage = new RegExp('^[a-zA-Z0-9\.\,\\ ]+$').test(Locationform.message);
        const validLatitude = new RegExp('^[0-9\.]+$').test(Locationform.latitude);
        const validLongitude = new RegExp('^[0-9\.]+$').test(Locationform.longitude);
        const validLocationaccuracy = new RegExp('^[0-9\.]+$').test(Locationform.locationaccuracy);

        validPurpose ? setPurpose(true) : setPurpose(false);
        validMessage ? setMessage(true) : setMessage(false);



        if (validPurpose && validMessage && validLatitude && validLongitude && validLocationaccuracy) {

            await fetch('http://localhost:4000/api/location/submit', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(Locationform)

            }).then(async (response) => {

                const data = await response.json();
                //  console.log(data)

                if (data.status) {
                    requestLochistory()
                    setSuccess(true)
                    setSuccessmsg(data.message)
                    ref.current.click()
                    setLatitude(0)
                    setLongitude(0)
                    setGetlocation(false)
                    setLocationform({
                        latitude: '',
                        longitude: '',
                        locationaccuracy: '',
                        purpose: '',
                        message: ''

                    })
                    setTimeout(() => {
                        setSuccess(false)

                    }, 5000);
                } else {
                    setError(true)
                    setError(data.message)
                    setTimeout(() => {
                        setError(false)

                    }, 5000);
                }

                setLoaderAnim(false)
            }).catch(async (err) => {
                //  console.log(err.message)
                setError(true)
                setError(err.message)
                setTimeout(() => {
                    setError(false)

                }, 5000);
                setLoaderAnim(false)
            })


        } else {

            //  console.log('wrong')
            setLoaderAnim(false)
        }

    }

    const valueChanged = async (e) => {
        setLocationform({ ...Locationform, [e.target.name]: e.target.value.replace(/\s+/g, ' ').trim() })
    }

    const closestatusmsg = () => {
        setError(false)
        setSuccess(false)
    }

    const requestLochistory = async (qdate) => {
        //  console.log(qdate)

        if (qdate === undefined) {
            qdate = new Date()
        }
        //  console.log(qdate)
        const reqdate = new Date(qdate)
        const date = reqdate.getDate()
        const month = reqdate.getMonth() + 1
        const year = reqdate.getFullYear()

        const url = `http://localhost:4000/api/location/myloc/${date}/${month}/${year}`;

        await fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(async (response) => {

            const data = await response.json();
            //  console.log(data)

            if (data.status) {
                if (data.data.length > 0) {
                    setReqLoc(data.data)
                    setReqLocstatus(true)
                } else {
                    setReqLocstatus(false)
                }


            } else {

            }


        }).catch(async (err) => {


        })






    }

    useEffect(() => {
        requestLochistory()
        //  console.log('first')
    }, [])

    return (
        <>
            {LoaderAnim && <Loader />}

            <div className="w-full  h-max p-2 pb-5">

                <div className="bg-white w-full h-max shadow-lg rounded-lg ">

                    <div className="w-full bg-indigo-500 p-2 flex justify-center items-center rounded-t-lg">
                        <svg className="h-5 pr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" fill='white' /></svg>
                        <span className="heading text-white text-lg">My Location</span>
                    </div>

                    <form className="p-2 w-full flex flex-col " onSubmit={(e) => { submitLocation(e) }}>

                        <div className="w-full flex">

                            <div className="w-1/2 m-1">
                                <label htmlFor="lat">Latitude</label>
                                <input className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" type="text" name="lat" id="lat" placeholder="Latitude" value={Latitude} required readOnly />
                            </div>

                            <div className="w-1/2 m-1">
                                <label htmlFor="long">Longitude</label>
                                <input className="bg-blue-50 border border-blue-500 text-blue-900 placeholder-blue-700 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-blue-400" type="text" name="long" id="long" placeholder="Longitude" value={Longitude} required readOnly />
                            </div>


                        </div>

                        <div className="">
                            {Getlocation && <p className="text-green-500 text-sm">✅Located Successfully</p>}

                            {fetchinglocation && <div> <svg role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#c9c9c9" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg> Getting Your Location</div>
                            }

                            {!Getlocation && <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-1 float-right leading-5" onClick={() => { getLocation() }}>
                                <svg className="h-4 inline-block pr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M176 256C176 211.8 211.8 176 256 176C300.2 176 336 211.8 336 256C336 300.2 300.2 336 256 336C211.8 336 176 300.2 176 256zM256 0C273.7 0 288 14.33 288 32V66.65C368.4 80.14 431.9 143.6 445.3 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H445.3C431.9 368.4 368.4 431.9 288 445.3V480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480V445.3C143.6 431.9 80.14 368.4 66.65 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H66.65C80.14 143.6 143.6 80.14 224 66.65V32C224 14.33 238.3 0 256 0zM128 256C128 326.7 185.3 384 256 384C326.7 384 384 326.7 384 256C384 185.3 326.7 128 256 128C185.3 128 128 185.3 128 256z" fill="white" />
                                </svg>
                                Locate Me
                            </button>}
                        </div>

                        <div className="clear-both w-full ">
                            <input maxLength={200} minLength={5} disabled={!Getlocation} className="w-full tracking-wide my-3 p-2.5 border-2 rounded-lg text-base" type="text" name="purpose" id="purpose" placeholder="Purpose" required autoComplete='true' onChange={(e) => { valueChanged(e) }} />
                        </div>
                        {!Purpose && <p className="text-red-500 text-sm px-1">Only Alphabets And Numbers Are Allowed</p>}

                        <div className="clear-both w-full ">

                            <label htmlFor="message" className="block mb-2  font-medium text-gray-900 dark:text-gray-400">Your message</label>
                            <textarea maxLength={500} minLength={5} disabled={!Getlocation} name="message" id="message" rows="6" className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500   dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="Status Mesage" onChange={(e) => { valueChanged(e) }}></textarea>

                        </div>
                        {!Message && <p className="text-red-500 text-sm px-1 py-2">Only Alphabets And Numbers Are Allowed</p>}


                        <button disabled={!Getlocation} type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br  shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-base px-8 py-2.5 text-center mx-auto my-5">Submit</button>

                        <input type="reset" className='hidden' ref={ref} />

                    </form>

                </div>


                <div className="bg-white w-full h-max mt-4 shadow-xl rounded-lg ">
                    <div className="w-full bg-slate-600 p-2 flex justify-center items-center rounded-t-lg">
                        <svg className="h-5 pr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" fill='white' /></svg>
                        <span className="heading text-white text-lg">Your Location History</span>
                    </div>

                    <div className="w-full flex bg-slate-200 ">
                        <input className="w-38 py-3 bg-transparent mx-auto outline-none font-medium text-blue-600" type="date" name="locdate" id="locdate" format="dd-mm-yyyy" onChange={(e) => { requestLochistory(e.target.value) }} />
                    </div>

                    <div className="w-full p-2">

                        {ReqLocstatus && ReqLoc.map((val) => {
                            return <div key={val._id} className="block overflow-hidden rounded-lg mb-3 border border-slate-500">

                                <iframe className="object-cover w-full h-60" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-ZiVsfySCG4Ck0KuHMqUfOTWUilM1ICc&q=${val.latitude},${val.longitude}&zoom=19&maptype=roadmap`}>
                                </iframe>

                                <div className="p-3 bg-gray-900">
                                    <p className="text-xs text-gray-500">


                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">latitude : {val.latitude}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Longitude : {val.longitude}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Date : {val.date}</span>
                                        <span className="text-xs inline-block py-1 px-2.5 mr-2 mb-1 leading-none text-center whitespace-nowrap align-baseline font-normal bg-gray-800 text-gray-400 rounded tracking-wide">Time : {val.time}</span>
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
