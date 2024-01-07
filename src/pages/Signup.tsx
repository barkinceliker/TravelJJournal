// Signup.tsx
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import backgroundImg from '../background/travel.jpeg';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoToFirstHomePage = () => {
    const enteredCode = prompt("Please enter the code");
  
    if (enteredCode && enteredCode.trim() === "1907") {
      // Code is correct, navigate to Home1
      navigate('/dashboardadmin');
    } else {
      // Code is incorrect or user canceled, show an alert or handle it as needed
      alert("Invalid code. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover' }}>
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold" style={{ color: 'white' }}>Travel Journal </h1>
            <p className="py-6 text-lg" style={{ color: 'white' }}>Travel Journal Web ile Maceralarınızı Yakalayın - Ultimate Seyahat Günlüğü Arkadaşınız</p>
          </div>
          <div className="cardx sm:w-[30rem] shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">E-mail</span>
                </label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-mail" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="input input-bordered" required />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">Sign Up</button>
                <button type="button" onClick={handleGoToFirstHomePage} className="btn btn-primary ml-0 mt-1">Admin Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signup;
