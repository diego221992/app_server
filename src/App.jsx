import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layout/AppLayout'
import Login from './components/auth/Login'
import Autoremove from './components/dashboard/autoremove/Autoremove'
import Manager from './components/dashboard/users/Manager'
import Profile from './components/dashboard/users/Profile'
import Server from './components/dashboard/settings/Server';
import Processes from './components/dashboard/requirements/processes/Processes';
import Support from './components/dashboard/requirements/support/Support';
import PassCode from './components/dashboard/pass_code/passCode';
import Domains from './components/dashboard/domains/Domains';
import SMSApis from './components/dashboard/smsapis/SmsApi';
import { PrivateRoute, PublicRoute, RoleRoute } from './components/auth/RouteGuards';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          {/* GRUPO 1: Solo accesibles si NO estás logueado */}
          <Route element={<PublicRoute />}>
            <Route path="/auth">
              <Route path="login" element={<Login />} />
            </Route>
          </Route>
          {/* GRUPO 2: Solo accesibles si ESTÁS logueado */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard">
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="autoremove" element={<Autoremove />} />
                
                <Route path="users/profile" element={<Profile />} />

                <Route element={<RoleRoute allowedRoles={['admin']} />}>
                  <Route path="users/manager" element={<Manager />} />
                  <Route path="server" element={<Server />} />
                  <Route path="smsapis" element={<SMSApis />} />
                  
                </Route>
                <Route path="requirements/support" element={<Support />} />
                <Route path="requirements/processes" element={<Processes />} />
                
                <Route path="passcode" element={<PassCode />} />
                <Route path="domains" element={<Domains />} />
                
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
