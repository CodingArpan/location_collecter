import React, { useState, useEffect } from 'react'
import Loader from '../common/Loader';
import Image from 'next/image'

export default function Employeedetails() {
    const [Profiledetails, setProfiledetails] = useState()
    const [Profilestatus, setProfilestatus] = useState(false)
    const [Allnames, setAllnames] = useState([])

    const [LoaderAnim, setLoaderAnim] = useState(false)
    const [Error, setError] = useState(false)
    const [Errormsg, setErrormsg] = useState('')
    const [Success, setSuccess] = useState(false)
    const [Successmsg, setSuccessmsg] = useState('')


    const findthisemployee = async (e) => {
        setLoaderAnim(true)

        e.preventDefault();
        console.log(e.target[0].value)
        const name = e.target[0].value;
        const validName = new RegExp('^[a-zA-Z ]+$').test(name);
        const exist = Allnames.findIndex((item) => { return item.fullname == name })
        console.log(exist)
        if (validName && exist !== -1) {

            await fetch('http://localhost:4000/profile/thisemployee', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ name: name.toLowerCase(), refferalid: Allnames[exist].refferalid })

            }).then(async (res) => {
                const data = await res.json();
                // console.log(data)
                if (data.status) {
                    setProfilestatus(false)
                    setProfiledetails(data.data)
                    setProfilestatus(true)
                    setSuccess(true)
                    setSuccessmsg(data.message)

                    setTimeout(() => {
                        setSuccess(false)

                    }, 3000);

                } else {
                    setError(true)
                    setErrormsg(data.message)


                }

                setLoaderAnim(false)

            }).catch((err) => {
                // console.log(err)
                setLoaderAnim(false)
                setError(true)
                setErrormsg('Server Is Not Responding Yet')
            })

        } else {
            setLoaderAnim(false)

        }

    }

    const closestatusmsg = () => {
        setError(false)
        setSuccess(false)
    }

    useEffect(() => {
        setLoaderAnim(true)
        fetch('http://localhost:4000/profile/allname', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',

        }).then(async (res) => {
            const data = await res.json();
            // console.log(data)
            if (data.status) {
                setAllnames(data.data)

            } else {
                setError(true)
                setErrormsg(data.message)
            }

            setLoaderAnim(false)
        }).catch((err) => {
            // console.log(err)
            setLoaderAnim(false)
            setError(true)
            setErrormsg('Server Is Not Responding Yet')
        })


    }, [])

    return (
        <>
            {LoaderAnim && <Loader />}


            <div className="w-full h-52 max-w-[500px] min-w-[300px] mx-auto my-3 mt-0 p-2 ">

                <form onSubmit={(e) => { findthisemployee(e) }} >
                    <div className="flex flex-col justify-center items-center">

                        <div className="w-full flex">
                            <input minLength="3" className="w-full outline-none border border-slate-700 p-2 rounded-lg my-2 mx-2" type="text" list="employees" name="employeename" id="employeename" required="required" placeholder="Enter Employee Name" />
                            <datalist id="employees">
                                {/* <option value="Pharma">Pharma</option> */}

                                {Allnames.length > 0 && Allnames.map((item) => {
                                    return <option className="capitalize" key={item.refferalid} value={item.fullname}>{item.fullname}</option>
                                })}
                            </datalist>

                        </div>

                        {Allnames.length > 0 && <button type="submit" className="w-36 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br  dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 my-2 text-center mr-2 mb-2 ">Find Employee</button>}

                    </div>
                </form>








                {Profilestatus &&
                    <div className="w-full h-max bg-gray-50 p-5 rounded-lg shadow-lg flex mob:flex-wrap justify-center items-center">

                        <Image className="bg-white h-44 w-52 mob:h-60 rounded-xl my-3 " src={`data:image/png;base64,${Profiledetails.currentpic}`} width="230" height="230" alt="Your Profile Picture" />

                        <div className="mx-5 w-full ">
                            <p className="w-full text-lg font-normal p-1 break-words mob:text-center">{Profiledetails.fullname.toUpperCase()}  </p>

                            <p className="text-blue-500 px-3 mob:text-center">( {Profiledetails.refferalid} )</p>

                            <p className="mob:w-full text-base font-normal p-1 inline-flex justify-center items-center break-words"><svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z" /></svg>{Profiledetails.mobile}</p>
                            <br />
                            <p className="mob:w-full text-base font-normal p-1 inline-flex justify-center items-center break-all"><svg className="h-4 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z" /></svg>{Profiledetails.email}</p>
                            <br />
                            <p className="mob:w-full text-base font-normal p-1 inline-flex justify-center items-center break-words"><svg className="h-4 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M320 336c0 8.844-7.156 16-16 16h-96C199.2 352 192 344.8 192 336V288H0v144C0 457.6 22.41 480 48 480h416c25.59 0 48-22.41 48-48V288h-192V336zM464 96H384V48C384 22.41 361.6 0 336 0h-160C150.4 0 128 22.41 128 48V96H48C22.41 96 0 118.4 0 144V256h512V144C512 118.4 489.6 96 464 96zM336 96h-160V48h160V96z" /></svg>{Profiledetails.position.toUpperCase()}</p>
                            <br />



                        </div>


                    </div>}





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
