import { useState, useRef } from 'react'
import Loader from '../Components/common/Loader';
import { useRouter } from 'next/router'
import Image from 'next/image';


export default function Home() {
  const ref = useRef()
  const forgetpass = useRef()

  const router = useRouter();
  const [Accstatus, setAccstatus] = useState(true)
  const [ShowPass, setShowPass] = useState(false);
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState(false)
  const [Errormsg, setErrormsg] = useState('')
  const [Success, setSuccess] = useState(false)
  const [Successmsg, setSuccessmsg] = useState('')
  const [Idvalidating, setIdvalidating] = useState(false)



  const registervslogin = () => {

    Accstatus ? setAccstatus(false) : setAccstatus(true)
    // console.log(Accstatus);
  }

  const closewarning = () => {
    setError(false)
    setSuccess(false)
  }


  // -------------------------Registration form-----------------------------------------------
  const [RegformSatt, setRegformSatt] = useState(true)
  const [RIDvalid, setRIDvalid] = useState(false)
  const [Refferalidvalidationsucess, setRefferalidvalidationsucess] = useState(false)
  const [Refferalidvalidationfail, setRefferalidvalidationfail] = useState(false)
  const [Refferalidvalidationmsg, setRefferalidvalidationmsg] = useState('')
  const [Pictoken, setPictoken] = useState('')


  const [Refferalid, setRefferalid] = useState(true)
  const [FullName, setFullName] = useState(true)
  const [Mail, setMail] = useState(true)
  const [Phone, setPhone] = useState(true)
  const [Position, setPosition] = useState(true)
  const [Photo, setPhoto] = useState(true)
  const [NewPass, setNewPass] = useState(true)
  const [ConfirmPass, setConfirmPass] = useState(true)
  const [MatchPass, setMatchPass] = useState(true)


  const [RegisterForm, setRegisterForm] = useState({
    refferalid: '',
    fullname: '',
    email: '',
    mobile: '',
    position: '',
    newpwd: '',
    confirmpwd: '',
    currentpic: '',
  })


  const RIDvalidation = async () => {
    setIdvalidating(true)
    const validRefferal = new RegExp('^[0-9]{5}$').test(RegisterForm.refferalid);
    validRefferal ? setRefferalid(true) : setRefferalid(false);
    const refferalid = { 'refferalid': RegisterForm.refferalid };
    // console.log(refferalid)
    if (validRefferal) {

      await fetch(`http://localhost:4000/api/new/validate`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(refferalid),

      }).then(async (response) => {
        const data = await response.json();
        console.log(data)
        if (data.validation) {
          setRefferalidvalidationfail(false)
          setRefferalidvalidationsucess(true)
          setRefferalidvalidationmsg(data.msg)
          setRIDvalid(true)
          setPictoken(data.id)
          document.getElementById('fullname').value = data.data.name.toUpperCase();
          document.getElementById('email').value = data.data.email.toLowerCase();
          document.getElementById('position').value = data.data.position;
          setRegisterForm({
            ...RegisterForm, fullname: `${data.data.name.toUpperCase()}`,
            email: `${data.data.email.toLowerCase()}`,
            position: `${data.data.position}`,
          })

        } else {

          setRefferalidvalidationsucess(false)
          setRefferalidvalidationfail(true)
          setRefferalidvalidationmsg(data.msg)
          setRIDvalid(false)

        }

        setIdvalidating(false)





      }).catch(async (err) => {
        console.log(err)
        setError(true)
        setErrormsg('Server Is Not Responding Yet')
        setIdvalidating(false)

      })
    } else {
      // setRIDvalid(true)
      console.log('error')
      setError(true)
      setErrormsg('Please Enter A Valid Refferal ID')
      setTimeout(() => {
        setError(false)

      }, 5000);
      setIdvalidating(false)

    }
  }

  const newRegistration = async (e) => {
    e.preventDefault();

    setLoading(true)

    const validRefferal = new RegExp('^[0-9]{5}$').test(RegisterForm.refferalid);
    const validName = new RegExp('^[a-zA-Z ]+$').test(RegisterForm.fullname);
    const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(RegisterForm.email);
    const validMobile = new RegExp('^[0-9]{10}$').test(RegisterForm.mobile);
    const validPosition = ['corporate', 'representative', 'regional_manager', 'manager'].includes(RegisterForm.position);
    const validCurrentPic = (RegisterForm.currentpic.size > 10000 && RegisterForm.currentpic.size < 300000) ? true : false;
    const validNewPassword = new RegExp('^[a-zA-Z0-9#%\+_-]+$').test(RegisterForm.newpwd);
    const validConfirmPassword = new RegExp('^[a-zA-Z0-9#%\+_-]+$').test(RegisterForm.confirmpwd);
    const matchPWD = (RegisterForm.newpwd === RegisterForm.confirmpwd) ? true : false;


    validRefferal ? setRefferalid(true) : setRefferalid(false);
    validName ? setFullName(true) : setFullName(false);
    validEmail ? setMail(true) : setMail(false);
    validMobile ? setPhone(true) : setPhone(false);
    validPosition ? setPosition(true) : setPosition(false);
    validCurrentPic ? setPhoto(true) : setPhoto(false);
    validNewPassword ? setNewPass(true) : setNewPass(false);
    validConfirmPassword ? setConfirmPass(true) : setConfirmPass(false);
    matchPWD ? setMatchPass(true) : setMatchPass(false);

    if (
      validRefferal &&
      validName &&
      validEmail &&
      validMobile &&
      validPosition &&
      validCurrentPic &&
      validNewPassword &&
      validConfirmPassword &&
      matchPWD
    ) {

      setRegformSatt(true)

      const newprofileData = new FormData();
      for (const key in RegisterForm) {
        newprofileData.append(key, RegisterForm[key]);
      }

      await fetch(`http://localhost:4000/api/new/register`, {

        method: 'POST',
        credentials: 'include',
        body: newprofileData

      }).then(async (response) => {
        const data = await response.json();
        console.log(data)
        setLoading(false)

        if (response.status === 200) {
          setSuccess(true)
          setSuccessmsg(`Hi ${data.name}! Your ${data.msg4user}`)
          ref.current.click()
          setTimeout(() => {
            setSuccess(false)
            router.reload('/')

          }, 5000);

        } else if (response.status === 500) {
          setError(true)
          setErrormsg(`Hi ${data.name} , ${data.msg4user}`)
        }


      }).catch(async (err) => {
        console.log(err.message)
        setError(true)
        setErrormsg('Server Is Not Responding Yet')
        setTimeout(() => {
          setError(false)

        }, 5000);
        setLoading(false)

      })


    } else {
      setRegformSatt(false)
      setLoading(false)

    }


  }

  const registerValueChanged = async (e) => {
    setRegisterForm({ ...RegisterForm, [e.target.name]: e.target.value.replace(/\s+/g, ' ').trim() })
    // console.log(RegisterForm)
  }

  const uploadCurrentpic = async (e) => {
    const file = e.target.files[0];
    // console.log(file, e)

    if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type) && file.size > 10000 && file.size < 300000) {

      setPhoto(true)
      const preveiwimg = document.querySelector(`.preveiwimg.${e.target.name}`);
      const img = preveiwimg.querySelector('.uploaedimg');
      const cancelbtn = preveiwimg.querySelector('.cancelbtn');
      const cameraicon = preveiwimg.querySelector('.camera');
      const uploadtxt = preveiwimg.querySelector('.uptxt');

      if (file) {

        const reader = new FileReader();
        reader.onload = function () {
          // console.log('onload running')
          const result = reader.result;
          preveiwimg.setAttribute('for', '');

          img.classList.replace('hidden', 'block')
          cancelbtn.classList.replace('hidden', 'block')
          cameraicon.classList.replace('block', 'hidden')
          uploadtxt.classList.replace('block', 'hidden')

          img.src = result;
        }

        cancelbtn.onclick = function () {
          // console.log('cncl btn running')

          img.src = '';

          img.classList.replace('block', 'hidden')
          cancelbtn.classList.replace('block', 'hidden')
          cameraicon.classList.replace('hidden', 'block')
          uploadtxt.classList.replace('hidden', 'block')


          setRegisterForm((val) => {
            return { ...val, [e.target.name]: '' }
          })


          e.target.value = '';

          setTimeout(() => {
            preveiwimg.setAttribute('for', `${e.target.name}`)
          }, 100);

        }

        reader.readAsDataURL(file);

        setRegisterForm({ ...RegisterForm, [e.target.name]: e.target.files[0] })


      } else {

        img.src = '';
        img.classList.replace('block', 'hidden')
        cancelbtn.classList.replace('block', 'hidden')
        cameraicon.classList.replace('hidden', 'block')
        uploadtxt.classList.replace('hidden', 'block')
        preveiwimg.setAttribute('for', `${e.target.name}`)
        setPhoto(false)

      }


    } else {
      setPhoto(false)
      // setRegisterForm({ ...RegisterForm, [e.target.name]: e.target.files[0] })

    }
  }

  // -------------------------Login form------------------------------------------------

  const [Inputstatus, setInputstatus] = useState(true)
  const [EmailMobile, setEmailMobile] = useState(true);
  const [passWD, setpassWD] = useState(true);
  const [Usertype, setUsertype] = useState(true);


  const [Loginform, setLoginform] = useState({
    userid: '',
    userpwd: '',
    usertype: ''
  })

  const getLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(Loginform.userid);
    const validMobile = new RegExp('^[0-9]{10}$').test(Loginform.userid);
    const validPassword = new RegExp('^[a-zA-Z0-9#%\+_-]+$').test(Loginform.userpwd);
    const validUser = ['corporate', 'representative', 'regional_manager', 'manager'].includes(Loginform.usertype);

    validEmail || validMobile ? setEmailMobile(true) : setEmailMobile(false);
    validPassword ? setpassWD(true) : setpassWD(false);
    validUser ? setUsertype(true) : setUsertype(false);

    if ((validEmail || validMobile) && validPassword && validUser) {
      setInputstatus(true)

      await fetch('http://localhost:4000/api/login/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(Loginform),

      }).then(async (response) => {
        const data = await response.json();
        console.log(data);
        setLoading(false);
        if (data.status) {

          router.reload();

        } else {
          setInputstatus(false)
          // setEmailMobile(false)
          // setpassWD(false)
          // setUsertype(false)

          setError(true)
          setErrormsg(data.message)





        }
      }).catch((error) => {
        setLoading(false);
        console.error('Error:', error);
        setError(true)
        setErrormsg('Server Is Not Responding Yet')
        setTimeout(() => {
          setError(false)

        }, 5000);

      });

    } else {
      setInputstatus(false)
      setLoading(false)


    }

  }

  const logINvalueChanged = async (e) => {
    setLoginform({ ...Loginform, [e.target.name]: e.target.value.replace(/\s+/g, ' ').trim() })

  }

  // --------------------Reset Password--------------------------

  const [Resetacc, setResetacc] = useState({
    emailmob: '',
    refferalid: ''
  })
  const [Emailmob, setEmailmob] = useState(true)
  const [id, setid] = useState(true)

  const valueforreset = async (e) => {
    setResetacc({ ...Resetacc, [e.target.name]: e.target.value.replace(/\s+/g, ' ').trim() })
  }

  const resetpassword = async (e) => {

    console.log(Resetacc)
    e.preventDefault();
    setLoading(true)
    const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(Resetacc.emailmob);
    const validMobile = new RegExp('^[0-9]{10}$').test(Resetacc.emailmob);
    const validid = new RegExp('^[0-9]{5}$').test(Resetacc.refferalid);

    validEmail || validMobile ? setEmailmob(true) : setEmailmob(false);
    validid ? setid(true) : setid(false);

    if (validid && (validEmail || validMobile)) {

      await fetch('http://localhost:4000/api/login/forget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(Resetacc),

      }).then(async (response) => {
        const data = await response.json();
        console.log(data);
        setLoading(false);
        if (data.status) {

          setSuccess(true)
          setSuccessmsg(data.message)
          document.getElementById('emailmob').value = ''
          document.getElementById('refferalid').value = ''
          forgetpass.current.click()

        } else {

          setError(true)
          setErrormsg(data.message)
          setTimeout(() => {
            setError(false)

          }, 5000);
        }

      }).catch((error) => {
        setLoading(false);
        console.error('Error:', error);
        setError(true)
        setErrormsg('Server Is Not Responding Yet')
        setTimeout(() => {
          setError(false)

        }, 5000);

      });



    } else {
      setLoading(false)
    }


  }













  // --------------------Tailwind CSS--------------------------

  const destinp = "tracking-wide my-3 p-3 border-2 rounded-lg tab:text-lg desk:text-lg xldesk:text-xl";
  const button = "tracking-wide my-3 p-3  rounded-full text-lg text-white font-medium bg-blue-600 shadow-lg shadow-blue-500/50 hover:bg-blue-700 w-52 mx-auto";
  const loginwindow = 'my-3 p-5 flex flex-col bg-white rounded-xl shadow-xl  desk:max-w-[500px] desk:min-w-[350px] w-full min-w-[290px] max-w-[500px]';
  return (

    <>

      {Loading && <Loader />}

      {Success && <div id="alert-3" className="flex p-4 mb-4 bg-green-100 rounded-lg dark:bg-green-200 fixed w-full z-50" role="alert">
        <svg className="flex-shrink-0 w-5 h-5 text-green-700 dark:text-green-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
        <div className="ml-3 text-sm font-medium text-green-700 dark:text-green-800">
          {Successmsg}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-green-100 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-green-200 dark:text-green-600 dark:hover:bg-green-300" data-dismiss-target="#alert-3" aria-label="Close" onClick={() => { closewarning() }}>
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" ></path></svg>
        </button>
      </div>}

      {Error && <div id="alert-4" className="flex p-4 mb-4 bg-yellow-100 rounded-lg dark:bg-yellow-200  fixed w-full z-50" role="alert">
        <svg className="flex-shrink-0 w-5 h-5 text-yellow-700 dark:text-yellow-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
        <div className="ml-3 text-sm font-medium text-yellow-700 dark:text-yellow-800">
          {Errormsg}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-yellow-100 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 dark:bg-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-300" data-dismiss-target="#alert-4" aria-label="Close" onClick={() => { closewarning() }} >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>}

      {Accstatus && <> <form onSubmit={(e) => { getLogin(e) }} >

        <div className="conatiner flex flex-col items-center p-5 bg-gray-100 h-auto min-h-screen max-h-max">

          <Image className="h-16 my-3" width="64" height="64" src="/Images/svg.svg" alt="Logo" />

          <h1 className="youracc my-3 font-semibold text-center mob:text-xl tab:text-2xl desk:text-2xl xldesk:text-2xl">Sign Into Your Account</h1>
          <h1 className="createacc my-1 text-center ">Do not Have Account, <span className="text-blue-600 cursor-pointer" onClick={() => registervslogin()} >Create New Profile</span></h1>

          <div className={`loginSection ${loginwindow} relative `}>

            <input className={`userid ${destinp} `} type="text" name="userid" id="userid" placeholder="Email or Phone Number" required autoComplete='true' onChange={(e) => { logINvalueChanged(e) }} />
            {!EmailMobile && <p className="text-red-600 mx-3 text-sm ">Input Is Neither An Email Nor A Mobile Number</p>}



            <select className={`usertype ${destinp}`} name="usertype" id="usertype" defaultValue={'DEFAULT'} required onChange={(e) => { logINvalueChanged(e) }} >
              <option className="m-5" value="DEFAULT" disabled >Select Login Type</option>
              <option className="m-5" value="corporate">Corporate</option>
              <option className="m-5" value="representative">Representative</option>
              <option className="m-5" value="regional_manager">Regional Manager</option>
              <option className="m-5" value="manager">Manager</option>
            </select>
            {!Usertype && <p className="text-red-600 mx-3 text-sm">Please Select A User Type</p>}


            <input maxLength={20} className={`userpwd ${destinp}`} type={ShowPass ? 'text' : 'password'} name="userpwd" id="userpwd" placeholder="Password" required autoComplete='true' onChange={(e) => { logINvalueChanged(e) }} />
            {!passWD && <p className="text-red-600 mx-3 text-sm">Please Enter Your Valid Password</p>}
            <div className="showhide w-fit py-3 inline-block">
              <input className="mx-1 w-4 h-4" type="checkbox" name="showhide" id="showhide" onChange={() => { ShowPass ? setShowPass(false) : setShowPass(true) }} />

              <label className="mx-1 text-lg" htmlFor="showhide">Show Password</label>
            </div>




            {!Inputstatus && <p className="text-red-600 mx-3 text-sm text-center">Verify Your Login Credentials</p>}
            <button className={`login ${button} `} type="submit">Log In</button>

            <hr className="mt-2" />
            {/* ------------------------------------------------------------------------------------- */}

            <label htmlFor="forgot" className="forget tracking-wide my-3 p-2 text-center text-blue-700 cursor-pointer font-medium tab:text-lg desk:text-lg xldesk:text-xl">Forgot Password</label>




          </div>

        </div>

      </form>

        <input type="checkbox" className="peer hidden" name="forgot" id="forgot" ref={forgetpass} />

        <div className="w-full h-full fixed top-0 py-44 px-3   hidden peer-checked:block bg-black/30 backdrop-blur-sm">

          <div className="w-full h-max left-0 top-10 p-5 bg-white  rounded-xl drop-shadow-2xl border border-purple-600   desk:max-w-[500px] desk:min-w-[350px] min-w-[290px] max-w-[500px] mx-auto" id="forgetpass">


            <div className="cursor-pointer p-2 absolute -top-3 -right-3 bg-white rounded-xl" onClick={() => { forgetpass.current.click() }}>
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z" fill="#7b42f5" /></svg>
            </div>




            <input className="w-full py-2 px-3 my-3 rounded-lg bg-slate-700 outline-none text-gray-300" type="text" name="emailmob" id="emailmob" placeholder="Enter Email or Mobile No." required autoComplete='true' onChange={(e) => { valueforreset(e) }} />

            {!Emailmob && <p className="w-full text-red-500 text-sm px-3">Don not looks like an email or a mobile number</p>}

            <input maxLength={5} minLength={5} className="w-full py-2 px-3 my-3 rounded-lg bg-slate-700 outline-none text-gray-300" type="text" name="refferalid" id="refferalid" placeholder="Enter Your ID" required autoComplete='true' onChange={(e) => { valueforreset(e) }} />
            {!id && <p className="w-full text-red-500 text-sm px-3">Not a valid ID</p>}

            <div className="flex justify-center items-center my-2">

              <button onClick={(e) => { resetpassword(e) }} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br  dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Reset Account Password</button>

            </div>

            <hr />

          </div>

        </div>
      </>

      }

      {!Accstatus && <form encType="multipart/form-data" onSubmit={(e) => { newRegistration(e) }} >

        <div className="conatiner flex flex-col items-center p-5 bg-gray-100 h-auto min-h-screen max-h-max">

          <Image className="h-16 my-3" width="64" height="64" src="/Images/svg.svg" alt="Logo" />

          <h1 className="youracc my-3 font-semibold text-center mob:text-xl tab:text-2xl desk:text-2xl xldesk:text-2xl">Create A New Profile</h1>
          <h1 className="createacc my-1 text-center ">Already Have An Account, <span className="text-blue-600 cursor-pointer" onClick={() => registervslogin()}>Sign In Now</span></h1>

          <div className={`loginSection ${loginwindow} relative `}>

            <input disabled={RIDvalid} maxLength={5} className={`refferalid ${destinp} `} type="text" name="refferalid" id="refferalid" placeholder="Your Refferal ID" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!Refferalid && <p className="text-red-600 mx-3 text-sm ">Input Is Not A Valid Refferal ID</p>}

            {Refferalidvalidationfail && <p className="text-red-600 my-3 text-sm">❌ {Refferalidvalidationmsg}</p>}

            {Refferalidvalidationsucess && <p className="text-green-500 my-3 text-sm">✅ {Refferalidvalidationmsg}</p>}

            {Idvalidating && <div> <svg role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#c9c9c9" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg> Validating</div>
            }


            {!RIDvalid && <div type="button" onClick={() => { RIDvalidation() }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2 cursor-pointer" >Validate Refferal ID</div>}

            <hr></hr>

            <input disabled={!RIDvalid} className={`fullname ${destinp} `} type="text" name="fullname" id="fullname" placeholder="Your Full Name" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!FullName && <p className="text-red-600 mx-3 text-sm text-center">Name Must Be 5 to 100 Characters Long & Contain Only Alphabets</p>}

            <input disabled={!RIDvalid} className={`email ${destinp} `} type="email" name="email" id="email" placeholder="Your Email Address" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!Mail && <p className="text-red-600 mx-3 text-sm text-center">Your Input Not Looks Like An Email, Please Check Again</p>}

            <input disabled={!RIDvalid} maxLength={10} className={`mobile ${destinp} `} type="text" name="mobile" id="mobile" placeholder="Your Mobile Number" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!Phone && <p className="text-red-600 mx-3 text-sm text-center">Mobile Number Must Be Contain Only Numbers & 10 Characters Long</p>}

            <select disabled={!RIDvalid} className={`position ${destinp}`} name="position" id="position" defaultValue={'DEFAULT'} required onChange={(e) => { registerValueChanged(e) }} >
              <option className="m-5" value="DEFAULT" disabled >Select Your Position</option>
              <option className="m-5" value="corporate">Corporate</option>
              <option className="m-5" value="representative">Representative</option>
              <option className="m-5" value="regional_manager">Regional Manager</option>
              <option className="m-5" value="manager">Manager</option>
            </select>
            {!Position && <p className="text-red-600 mx-3 text-sm text-center">Please Select Your Position</p>}


            <div className="w-max h-max relative my-2">

              <div htmlFor="currentpic">Upload Current Photo With Given Token</div>

              <input disabled={!RIDvalid} className="hidden" type="file" name="currentpic" id="currentpic" onChange={(e) => { uploadCurrentpic(e) }} />

              <label htmlFor="currentpic" className="preveiwimg currentpic block w-40 h-40 bg-blue-400 rounded-lg my-3 ">

                <svg className="cancelbtn absolute w-6 bottom-44 left-36 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z" fill="black" /></svg>

                <img src="" className="uploaedimg w-full h-full rounded-lg hidden" alt="your image" />


                <svg className="camera px-14 pt-10 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z" fill="white" /></svg>
                <div className="uptxt text-center text-white block">Click to Upload</div>



              </label>

              {/* <div className="my-20 inline-block absolute bottom-0 float-right right-5 w-1/3 h-24 rounded-lg bg-[url('/Images/manholdingpage.png')] bg-contain bg-center bg-no-repeat bg-black">
              </div> */}

              <p className="text-sm break-all">Compress Your Image - <span className="text-red-600 text-sm"><a href="https://compressor.io/" className="px-3 py-5" target="_blank" rel="noreferrer">Image-Compressor.io</a></span></p>
              {/* <p className="text-lg">Your Token Number is <span className="text-red-600 text-2xl">{Pictoken}</span></p> */}

            </div>
            {!Photo && <p className="text-red-600 mx-3 text-sm text-center">Only .jpg , .png , .jpeg are allowed & File size should be Within 10KB to 300Kb</p>}




            <input disabled={!RIDvalid} maxLength={20} minLength={3} className={`userpwd ${destinp}`} type={ShowPass ? 'text' : 'password'} name="newpwd" id="newpwd" placeholder="New Password" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!NewPass && <p className="text-red-600 mx-3 text-sm">a-z A-Z 0-9 Characters Are Allowed</p>}

            <input disabled={!RIDvalid} maxLength={20} minLength={3} className={`confirmpwd ${destinp}`} type={ShowPass ? 'text' : 'password'} name="confirmpwd" id="confirmpwd" placeholder="Confirm Password" required autoComplete='true' onChange={(e) => { registerValueChanged(e) }} />
            {!ConfirmPass && <p className="text-red-600 mx-3 text-sm">Please Confirm Your Password</p>}
            {!MatchPass && <p className="text-red-600 mx-3 text-sm">Please Confirm Your Password</p>}


            <div className="showhide w-fit py-3 inline-block">
              <input disabled={!RIDvalid} className="mx-1 w-4 h-4" type="checkbox" name="showhide" id="showhide" onChange={() => { ShowPass ? setShowPass(false) : setShowPass(true) }} />

              <label className="mx-1 text-lg" htmlFor="showhide">Show Password</label>
            </div>



            {!RegformSatt && <p className="text-red-600 mx-3 text-sm text-center">Verify Your Login Credentials</p>}

            <button disabled={!RIDvalid} className={`login ${button} `} type="submit">Create Profile</button>

            <hr className="mt-2" />

          </div>


        </div>

        <input ref={ref} type="reset" className="hidden" />

      </form>}


    </>

  )
}

