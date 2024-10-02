import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const BASE_URL = 'http://localhost:9000'

const CitiesContext = createContext(null)

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ''
}

function reducer (state, action) {
    switch (action.type) {
        case 'loading': 
            return {
                ...state,
                isLoading: true
            }
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            }
        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            }
        case 'city/created':
            return {
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            }
        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(City => City.id !== action.payload)
            }
        case 'rejected':
            return {
                ...state,
                isLoaing: false,
                error: action.payload
            }
        default:
            throw new Error('unkown action type')
    }
}

function CitiesProvider ({children}) {

    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState) 

    useEffect(function () {
        async function fetchCities() {
        dispatch({type: "loading"})
        try {
            const res = await fetch(`${BASE_URL}/cities`)
            const data = await res.json()
            dispatch({type: "cities/loaded", payload: data})
        } catch (err) {
            dispatch({type: "rejected", payload: 'there was a problem'})
        } 
        }
        fetchCities()
    }, [])

    const getCity = useCallback (async function getCity(id) {
        if(Number(id) === currentCity.id) return 
        dispatch({type: "loading"})
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`)
            const data = await res.json()
            dispatch({type: "city/loaded", payload: data})
        } catch (err) {
            dispatch({type: "rejected", payload: 'there was a problem'})
        }
    }, [currentCity.id])


    async function createCity(newCity) {
        dispatch({type: "loading"})
        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    'content-Type': 'application/json', 
                }
            })
            const data = await res.json()
            dispatch({type: "city/created", payload: data})
        } catch (err) {
            dispatch({type: "rejected", payload: 'there was a problem'})
        }
    }

    async function deleteCity(id) {
        dispatch({type: "loading"})
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
            method: "DELETE",
            })
            dispatch({type: "city/deleted", payload: id})
        } catch (err) {
            dispatch({type: "rejected", payload: 'there was a problem'})
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
                getCity,
                createCity,
                deleteCity
            }}
        >
            {children}
        </CitiesContext.Provider>
    )
}

function useCities () {
    const context = useContext(CitiesContext)
    if (context === undefined) throw new Error("you are calling the context value in a wrong place")
    return context
}

export {CitiesProvider, useCities}