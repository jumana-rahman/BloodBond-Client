"use client";

import "@/styles/auth.css";

export default function FloatingInput({
    label,
    register,
    name,
    error,
    type="text"
}) {

    return (

        <div>

            <div className="input-group">

                <input
                    type={type}
                    placeholder=" "
                    {...register(name)}
                    className="input-field"
                    name={name}
                    value={value}
                    onChange={onChange}
                />

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