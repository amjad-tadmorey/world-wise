import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { CitiesProvider } from "./contexts/CitiesContext.jsx"
import { AuthProvider } from "./contexts/FakeAuthContext.jsx"
import ProtectedRout from "./pages/ProtectedRout.jsx"

import Product from "./pages/Product.jsx"
import Pricing from "./pages/Pricing.jsx"
import Homepage from "./pages/Homepage.jsx"
import PageNotFound from "./pages/PageNotFound.jsx"
import AppLayout from "./pages/AppLayout.jsx"
import Login from "./pages/Login.jsx"

// const Homepage = lazy()

import CityList from "./components/CityList.jsx"
import CountryList from "./components/CountryList.jsx"
import City from "./components/City.jsx"
import Form from "./components/Form.jsx"



export default function App() {

  return (
    <AuthProvider>
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />}/>
          <Route path="product" element={<Product />}/>
          <Route path="pricing" element={<Pricing />}/>
          <Route path="login" element={<Login />}/>
          <Route path="app" element={
            <ProtectedRout>
              <AppLayout />
            </ProtectedRout>
          }>
            <Route index element={<Navigate to={'cities'} replace/>}/>
            <Route path="cities" element={<CityList />}/>
            <Route path="cities/:id" element={<City />} />
            <Route path="countries" element={<CountryList />}/>
            <Route path="form" element={<Form />}/>
          </Route>
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
  )
}
