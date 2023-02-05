// import Head from "next.head";
import { useState, useEffect } from "react";
import { server } from "../config";
import queryString from "query-string";
// import axios from "axios";
import Router from "next/router";
import Link from "next/link";

export default function Home({ adobeAPIKey, adobeAPISecret }) {
  const [connected, setconnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const redirectUrl = "https://aspekto.vercel.app/callback";
  const crypto = require("crypto");

  const [session, setSession] = useState({});

  const handleLogin = () => {
    /* This will prompt user with the Adobe auth screen */
    Router.push(
      `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeAPIKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=${redirectUrl}`
    );
  };

  const handleCallback = () => {
    const query = Router.query;
    /* Retrieve authorization code from query */
    const code = query.code;

    /* Perform request to retrieve token */
    fetch(
      `https://ims-na1.adobelogin.com/ims/token?grant_type=authorization_code&client_id=${adobeAPIKey}&client_secret=${adobeAPISecret}&code=${code}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        /* Store the token in session */
        setSession({ token: data.access_token });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function getClientAuth() {
    // generate a random string for the state parameter
    const state = crypto.randomBytes(32).toString("hex");
    // store the state parameter in the user's session
    sessionStorage.setItem("state", state);

    console.log(state);
    // construct the authorization request URL
    const authUrl = `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeAPIKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=${redirectUrl}&state=${state}`;
    // `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeApiKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=https://localhost:8000/callback`
    // redirect the user to the authorization URL
    Router.push(authUrl);
  }

  // Pegando o status do meu client ID
  async function getHealthStatus() {
    const responseHealth = await fetch(`https://lr.adobe.io/v2/health`, {
      headers: {
        "x-api-key": `${adobeAPIKey}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(responseHealth.status);
    const responseAuth = await fetch(
      `https://ims-na1.adobelogin.com/ims/.well-known/openid-configuration`
    );
    console.log(responseAuth);
  }

  return (
    <main className="pt-24 flex flex-col w-full items-center min-h-screen">
      <button
        className="flex py-2 px-6 text-gray-700 justify-center border-gray-700 border cursor-pointer text-sm rounded-xl shadow-md hover:text-gray-900 focus:border-gray-900"
        onClick={
          async () => (setconnected(true), getHealthStatus())
          // , getHealthStatus()
        }
      >
        status do client ID
      </button>

      <button
        className="flex py-2 px-6 text-gray-700 justify-center border-gray-700 border cursor-pointer text-sm rounded-xl shadow-md hover:text-gray-900 focus:border-gray-900"
        onClick={
          async () => (setconnected(true), getClientAuth())
          // , getHealthStatus()
        }
      >
        Get client authorization
      </button>
      <Link
        href="/adobeLogin"
        className="flex py-2 px-6 text-gray-700 justify-center border-gray-700 border cursor-pointer text-sm rounded-xl shadow-md hover:text-gray-900 focus:border-gray-900"
      >
        Link to client authorization
      </Link>
      <div>
        <button onClick={handleLogin}>Login</button>
        {session.token ? <p>User logged in</p> : <p>User not logged in</p>}
      </div>
    </main>
  );
}

// Pegando os IDs do arquivo .env para passar pro componente Home
export const getStaticProps = async () => {
  require("dotenv").config();
  const adobeAPIKey = process.env.ADOBE_API_KEY;
  const adobeAPISecret = process.env.ADOBE_API_SECRET;
  return {
    props: {
      adobeAPIKey,
      adobeAPISecret,
    },
  };
};
