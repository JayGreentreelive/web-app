import { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { get } from 'lodash'
import { useAuth } from './'
import gql from 'graphql-tag'
import moment from 'moment'

const GET_CURRENT_PERSON = gql`
    query {
        currentUser {
            profile {
                firstName
                lastName 
            }
        }
    }
`

const useCurrentUser = (fields) => {
    const { token, isLoggedIn, logout } = useAuth()
    const [doRefetch, setRefetch] = useState(false)
    const [getCurrentUser, {
        data,
        loading,
        error,
        called,
        refetch
    }] = useLazyQuery(GET_CURRENT_PERSON)

    useEffect(() => {
        if (isLoggedIn) setRefetch(true)
    }, [token])

    try {
        if (doRefetch) {
            // If the state of doRefetch is true,
            //  attempt to refetch the data, then set the
            //  state to false to avoid an infinite loop
            refetch()
            setRefetch(false)
        } else if (error && !doRefetch && !loading) {
            // Log error and log out if there is an error found
            //  Ignore the error if doRefetch is set to true because
            //  the error is left over from a previous request and
            //  ignore errors if the request is still loading
            console.error("Authentication error: logging out")
            logout()
        }

        // Request data on initial load:
        //  if the request has not already been called,
        //  check to see if the use is logged in before calling
        if (!called && isLoggedIn) {
            getCurrentUser()
        }
    } catch (e) {
        console.error('GQL error:', { e })
    }

    console.log({ isLoggedIn, token })
    console.log({ data, loading, error, called })
    return {
        currentUser: get(data, 'currentUser.profile', null),
        loading,
        error
    }
}

export {
    useCurrentUser
}