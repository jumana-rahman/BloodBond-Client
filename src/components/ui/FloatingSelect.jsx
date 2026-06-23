"use client";

import "@/styles/auth.css";

export default function FloatingSelect({
    label,
    register,
    name,
    error,
    options=[]
}){

    return(

        <div>

            <div className="input-group">

                <select
                    defaultValue=""
                    {...register(name)}
                    className="input-field"
                >

                    <option value="" disabled>

                    </option>

                    {

                        options.map(option=>(

                            <option
                                key={option}
                                value={option}
                            >

                                {option}

                            </option>

                        ))

                    }

                </select>

                <label className="input-label">

                    {label}

                </label>

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