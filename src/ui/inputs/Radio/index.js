import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/fontawesome-pro-light'

const parseValue = (n) => typeof (n) === 'string'
    ? { label: n, value: n }
    : n

const Checkbox = ({
    options,
    onClick,
    type,
    error,
    value,
    label,
    ...buttonProps
}) => {
    const types = typeof (type) === 'string'
        ? { default: type, hover: type, checked: type }
        : type

    return (
        <div
            className={classnames(
                'd-flex',
                'flex-column'
            )}
        >
            {label &&
                <div>
                    <label>
                        {label}
                    </label>
                </div>
            }
            {options.map((n, i) => {
                const { label: radioLabel, value: radioValue } = parseValue(n)
                const checked = value === radioValue

                return (
                    <div
                        key={i}
                        className="text-left"
                    >
                        <button
                            onClick={() => onClick(radioValue)}
                            className={classnames(
                                'btn',
                                'btn-radio',
                                'my-1',
                                {
                                    [`btn-outline-${types.default}`]: !checked,
                                    [`btn-outline-${types.checked}`]: checked,
                                }
                            )}
                            {...buttonProps}
                        >
                            {checked &&
                                <i className="fas fa-circle pl-1"></i>
                            }
                        </button>
                        {radioLabel &&
                            <label
                                className={classnames(
                                    'ml-3',
                                    'input-label'
                                )}
                            >
                                {radioLabel}
                            </label>
                        }
                    </div>
                )
            })}

            {error &&
                <div>
                    <label
                        className={classnames(
                            'ml-3',
                            'input-label-sm',
                            'text-danger'
                        )}
                    >
                        {error}
                    </label>
                </div>
            }
        </div>
    )
}

Checkbox.propTypes = {
    options: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            })
        ),
    ]),
    value: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            default: PropTypes.string,
            hover: PropTypes.string,
            checked: PropTypes.string
        })
    ]),
    label: PropTypes.string,
}

Checkbox.defaultProps = {
    options: [],
    checked: false,
    onClick: () => true,
    type: {
        default: 'dark',
        hover: 'primary',
        checked: 'primary',
    },
    label: null,
}

export default Checkbox