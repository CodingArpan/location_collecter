import React, { useState } from 'react'
import Loader from '../common/Loader';
import * as XLSX from 'xlsx';


export default function Generatelocreport() {
    const [daterange, setdaterange] = useState({
        startdate: '',
        enddate: ''
    })

    const [Start, setStart] = useState(true)
    const [End, setEnd] = useState(true)
    const [Validrange, setValidrange] = useState(true)
    const [LoaderAnim, setLoaderAnim] = useState(false)
    const [Error, setError] = useState(false)
    const [Errormsg, setErrormsg] = useState('')
    const [Success, setSuccess] = useState(false)
    const [Successmsg, setSuccessmsg] = useState('')

    const getdata = async (e) => {

        e.preventDefault()
        setLoaderAnim(true)
        const validstartdate = new RegExp('^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$').test(daterange.startdate)
        const validenddate = new RegExp('^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$').test(daterange.enddate)

        validstartdate ? setStart(true) : setStart(false)
        validenddate ? setEnd(true) : setEnd(false)

        const sd = new Date(daterange.startdate).getDate()
        const sm = new Date(daterange.startdate).getMonth()
        const sy = new Date(daterange.startdate).getFullYear()

        const ed = new Date(daterange.enddate).getDate()
        const em = new Date(daterange.enddate).getMonth()
        const ey = new Date(daterange.enddate).getFullYear()
        let validdaterange = false;

        if (sy === ey) {
            if (sm < em) {

                validdaterange = true

            } else if (sm === em) {
                if (sd < ed) {
                    validdaterange = true
                }

            }

        } else if (sy < ey) {

            validdaterange = true

        }

        validdaterange ? setValidrange(true) : setValidrange(false);

        if (validstartdate && validenddate && validdaterange) {


            await fetch('http://localhost:4000/api/location/getreport', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(daterange)

            }).then(async (res) => {
                const data = await res.json();
                //  console.log(data)
                if (data.status) {
                    const fullreport = data.data


                    const setsofid = new Set();
                    for (const item of fullreport) {
                        setsofid.add(item.userid)
                    }
                    const arrayofid = Array.from(setsofid);

                    //  console.log(arrayofid)

                    const book = XLSX.utils.book_new();

                    for (const id of arrayofid) {

                        const thisemployee = fullreport.filter((item) => {
                            return item.userid == id
                        })

                        const employeeloc = [];
                        for (const loc of thisemployee) {
                            if (loc.verifyby.length > 0) {
                                const Newstring = ''
                                for (const verifier of loc.verifyby) {
                                    const arr = verifier.split('+');
                                    const string = `${arr[0]}(${arr[1]}),`
                                    Newstring += string
                                }
                                // //  console.log(Newstring)
                                loc.verifyby = Newstring;
                            }
                            employeeloc.push(loc);
                        }
                        //  console.log(employeeloc);
                        const newsheet = XLSX.utils.json_to_sheet(employeeloc);
                        XLSX.utils.book_append_sheet(book, newsheet, `${id}-${employeeloc[0].name}`, true);
                    }

                    XLSX.write(book, { booktype: "xlsx", type: "buffer" });
                    XLSX.write(book, { booktype: "xlsx", type: "binary" });
                    XLSX.writeFile(book, `Location Report ${sd}-${sm}-${sy} to ${ed}-${em}-${ey}.xlsx`);
                    setSuccess(true)
                    setSuccessmsg(data.message)

                } else {
                    setError(true)
                    setErrormsg(data.message)
                }
                setLoaderAnim(false)


            }).catch(async (err) => {
                //  console.log(err)
                setLoaderAnim(false)
                setError(true)
                setErrormsg('Server Is Not Responding Yet')

            })

        } else {
            setLoaderAnim(false)
        }

    }

    const valuechange = async (e) => {
        setdaterange({ ...daterange, [e.target.name]: e.target.value.trim() })
    }

    const closestatusmsg = () => {
        setError(false)
        setSuccess(false)
    }

    return (

        <>
            {LoaderAnim && <Loader />}

            <div className="w-full h-max px-2">
                <div className="bg-white w-full h-max shadow-lg rounded-lg  px-5 py-3">

                    <form onSubmit={(e) => { getdata(e) }} >
                        <div className="py-2">
                            <label className="w-full outline-none  p-2 rounded-lg  block" htmlFor="startdate">Start Date</label>
                            <input className="w-full outline-none border p-2 rounded-lg border-gray-300 block" type="date" name="startdate" id="startdate" format="dd/mm/yyyy" placeholder="Choose Start" required onChange={(e) => { valuechange(e) }} />
                        </div>
                        {!Start && <p className="w-full text-red-500 text-sm">Please select or enter any date only</p>}
                        <div className="py-2">
                            <label className="w-full outline-none  p-2 rounded-lg  block" htmlFor="enddate">End Date</label>
                            <input className="w-full outline-none border p-2 rounded-lg border-gray-300 block" type="date" name="enddate" id="enddate" format="dd/mm/yyyy" placeholder="Choose Start" required onChange={(e) => { valuechange(e) }} />
                        </div>
                        {!End && <p className="w-full text-red-500 text-sm">Please select or enter any date only</p>}
                        {!Validrange && <p className="w-full text-red-500 text-sm">End date must be after the start date</p>}
                        <div className="py-2 flex">
                            <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-3 mx-auto">Download</button>

                        </div>
                    </form>
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

