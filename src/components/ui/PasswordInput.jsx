"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import "@/styles/auth.css";

export default function PasswordInput({

    label,
    register,
    name,
    error

}){

    const [show,setShow]=useState(false);

    return(

        <div>

            <div className="input-group">

                <input

                    type={show ? "text":"password"}

                    placeholder=" "

                    {...register(name)}

                    className="input-field pe-12"
                    
                    value={value}

                    onChange={onChange}

                />

                <label className="input-label">

                    {label}

                </label>

                <button

                    type="button"

                    onClick={()=>setShow(!show)}

                    className="absolute right-4 top-4 text-gray-500 hover:text-[#C62828]"

                >

                    {

                        show ?

                        <FiEyeOff size={20}/>

                        :

                        <FiEye size={20}/>

                    }

                </button>

            </div>

            {

                error &&

                <p className="error-text">

                    {error.message}

                </p>

            }

        </div>

    )

}