import React, { forwardRef } from 'react';

const FormInput = forwardRef(({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder
}, ref) => {

    return (

        <div className="form-group">

            <label htmlFor={name}>
                {label}
            </label>

            <input
                ref={ref}
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={error ? 'input-error' : ''}
            />

            {error && (
                <p className="error-text">
                    {error}
                </p>
            )}

        </div>

    );

});

export default FormInput;