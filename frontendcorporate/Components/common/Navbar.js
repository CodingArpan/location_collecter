import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'

export default function Navbar() {
    const ref = useRef()
    const [Userdata, setUserdata] = useState()
    const [User, setUser] = useState(false)

    const [subloc, setsubloc] = useState(false)
    const [genref, setgenref] = useState(false)
    const [viewloc, setviewloc] = useState(false)
    const [genlocreport, setgenlocreport] = useState(false)
    const [Employeelist, setEmployeelist] = useState(false)


    useEffect(() => {
        try {

            //  console.log(document.cookie, '----------usertoken------------------')

            const usertoken = document.cookie.split(';').find((coki) => {
                return coki.includes('usertoken')
            }).split('=')[1];
            const userdata = usertoken.split('.')[1];
            const actualdata = JSON.parse(atob(userdata))
            // //  console.log(actualdata)
            setUserdata(actualdata)
            setUser(true)

            if (['master'].includes(actualdata.type)) {
                setsubloc(true)
                setgenref(true)
                setviewloc(true)
                setgenlocreport(true)
                setEmployeelist(true)
            } else if (['corporate'].includes(actualdata.type)) {
                setsubloc(false)
                setgenref(true)
                setviewloc(true)
                setgenlocreport(true)
                setEmployeelist(true)

            } else if (['regional_manager'].includes(actualdata.type)) {
                setsubloc(true)
                setgenref(true)
                setviewloc(false)
            } else if (['manager'].includes(actualdata.type)) {
                setsubloc(true)
                setgenref(true)
                setviewloc(false)
            } else if (['representative'].includes(actualdata.type)) {
                setsubloc(true)
                setgenref(false)
                setviewloc(false)
            }





        } catch (error) {
            //  console.log(error)
        }
    }, [])





    const router = useRouter();
    const logout = async () => {
        await fetch('http://localhost:4000/api/login/logout', {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',

            },
            credentials: 'include',
            body: JSON.stringify({ status: false })

        }).then(async (response) => {
            const data = await response.json();
            // //  console.log(data);
            router.replace('/')
        }).catch((error) => {
            //  console.error('Error:', error.message);
        });
    }

    const setURL = (option) => {

        ref.current.click()
        const current = router.pathname
        router.replace(`${current}${option}`)

    }





    return (
        <>

            <div className=" sticky top-0 right-0 z-50 bg-slate-50 p-2 w-full max-w-[500px] mx-auto">

                <label ref={ref} htmlFor="corpmenu" className="relative z-10 flex items-center p-2 text-sm text-white bg-slate-700 border border-slate-800 rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none justify-end cursor-pointer">
                    <span className="mx-1 tracking-wider">{User && Userdata.name.toUpperCase()}</span>
                    <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
                    </svg>
                </label>

                <input type="checkbox" className="peer hidden" name="corpmenu" id="corpmenu" />


                <div className="fullmenu absolute right-5 z-20 w-11/12 hidden py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 peer-checked:block drop-shadow-2xl       
                
                
                ">
                    <a className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">


                        <div className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"></div>





                        <div className="mx-1">
                            <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{User && Userdata.name.toUpperCase()} [{User && Userdata.id}]</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{User && Userdata.type.replace('_', ' ').toUpperCase()}</p>
                        </div>
                    </a>

                    <hr className="border-gray-200 dark:border-gray-700 " />


                    {/* -------------------------------------------------------------------------- */}



                    <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('') }}>
                        <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="currentColor"></path>
                            <path d="M6.34315 16.3431C4.84285 17.8434 4 19.8783 4 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16C13.5913 16 15.1174 16.6321 16.2426 17.7574C17.3679 18.8826 18 20.4087 18 22H20C20 19.8783 19.1571 17.8434 17.6569 16.3431C16.1566 14.8429 14.1217 14 12 14C9.87827 14 7.84344 14.8429 6.34315 16.3431Z" fill="currentColor"></path>
                        </svg>

                        <span className="mx-1">
                            view profile
                        </span>
                    </a>

                    <hr className="border-gray-200 dark:border-gray-700 " />

                    {subloc && <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('?submitLocation') }}>

                        <svg className="w-6 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M176 256C176 211.8 211.8 176 256 176C300.2 176 336 211.8 336 256C336 300.2 300.2 336 256 336C211.8 336 176 300.2 176 256zM256 0C273.7 0 288 14.33 288 32V66.65C368.4 80.14 431.9 143.6 445.3 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H445.3C431.9 368.4 368.4 431.9 288 445.3V480C288 497.7 273.7 512 256 512C238.3 512 224 497.7 224 480V445.3C143.6 431.9 80.14 368.4 66.65 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H66.65C80.14 143.6 143.6 80.14 224 66.65V32C224 14.33 238.3 0 256 0zM128 256C128 326.7 185.3 384 256 384C326.7 384 384 326.7 384 256C384 185.3 326.7 128 256 128C185.3 128 128 185.3 128 256z" fill="#3082fc" /></svg>

                        <span className="mx-1">
                            Submit Location
                        </span>
                    </a>}

                    {genref && <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('?generaterefferal') }}>
                        <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z" fill="#3082fc" /></svg>

                        <span className="mx-1">
                            Genearte Refferals
                        </span>
                    </a>}

                    {viewloc && <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('?viewalllocation') }}>

                        <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" fill="#3082fc" /></svg>

                        <span className="mx-1">
                            view Locations
                        </span>
                    </a>}


                    {genlocreport && <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('?generatelocreport') }}>

                        <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M152.1 38.16C161.9 47.03 162.7 62.2 153.8 72.06L81.84 152.1C77.43 156.9 71.21 159.8 64.63 159.1C58.05 160.2 51.69 157.6 47.03 152.1L7.029 112.1C-2.343 103.6-2.343 88.4 7.029 79.03C16.4 69.66 31.6 69.66 40.97 79.03L63.08 101.1L118.2 39.94C127 30.09 142.2 29.29 152.1 38.16V38.16zM152.1 198.2C161.9 207 162.7 222.2 153.8 232.1L81.84 312.1C77.43 316.9 71.21 319.8 64.63 319.1C58.05 320.2 51.69 317.6 47.03 312.1L7.029 272.1C-2.343 263.6-2.343 248.4 7.029 239C16.4 229.7 31.6 229.7 40.97 239L63.08 261.1L118.2 199.9C127 190.1 142.2 189.3 152.1 198.2V198.2zM224 96C224 78.33 238.3 64 256 64H480C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H256C238.3 128 224 113.7 224 96V96zM224 256C224 238.3 238.3 224 256 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H256C238.3 288 224 273.7 224 256zM160 416C160 398.3 174.3 384 192 384H480C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416zM0 416C0 389.5 21.49 368 48 368C74.51 368 96 389.5 96 416C96 442.5 74.51 464 48 464C21.49 464 0 442.5 0 416z" fill="#3082fc" /></svg>

                        <span className="mx-1">
                            Generate Location Report
                        </span>
                    </a>}


                    {Employeelist && <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => { setURL('?employeedetails') }}>

                        <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M184 88C184 118.9 158.9 144 128 144C97.07 144 72 118.9 72 88C72 57.07 97.07 32 128 32C158.9 32 184 57.07 184 88zM208.4 196.3C178.7 222.7 160 261.2 160 304C160 338.3 171.1 369.8 192 394.5V416C192 433.7 177.7 448 160 448H96C78.33 448 64 433.7 64 416V389.2C26.16 371.2 0 332.7 0 288C0 226.1 50.14 176 112 176H144C167.1 176 190.2 183.5 208.4 196.3V196.3zM64 245.7C54.04 256.9 48 271.8 48 288C48 304.2 54.04 319.1 64 330.3V245.7zM448 416V394.5C468 369.8 480 338.3 480 304C480 261.2 461.3 222.7 431.6 196.3C449.8 183.5 472 176 496 176H528C589.9 176 640 226.1 640 288C640 332.7 613.8 371.2 576 389.2V416C576 433.7 561.7 448 544 448H480C462.3 448 448 433.7 448 416zM576 330.3C585.1 319.1 592 304.2 592 288C592 271.8 585.1 256.9 576 245.7V330.3zM568 88C568 118.9 542.9 144 512 144C481.1 144 456 118.9 456 88C456 57.07 481.1 32 512 32C542.9 32 568 57.07 568 88zM256 96C256 60.65 284.7 32 320 32C355.3 32 384 60.65 384 96C384 131.3 355.3 160 320 160C284.7 160 256 131.3 256 96zM448 304C448 348.7 421.8 387.2 384 405.2V448C384 465.7 369.7 480 352 480H288C270.3 480 256 465.7 256 448V405.2C218.2 387.2 192 348.7 192 304C192 242.1 242.1 192 304 192H336C397.9 192 448 242.1 448 304zM256 346.3V261.7C246 272.9 240 287.8 240 304C240 320.2 246 335.1 256 346.3zM384 261.7V346.3C393.1 335 400 320.2 400 304C400 287.8 393.1 272.9 384 261.7z" fill="#3082fc" /></svg>

                        <span className="mx-1">
                            Employee List
                        </span>
                    </a>}



                    <a className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer" onClick={() => { logout() }}>
                        <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z" fill="red"></path>
                        </svg>

                        <span className="mx-1">
                            Sign Out
                        </span>
                    </a>


                </div>

            </div>



        </>
    )
}
