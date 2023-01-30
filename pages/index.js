// import Head from "next.head";
import { useState, useEffect } from "react";
import { server } from "../config";
import queryString from "query-string";
// import axios from "axios";
import Router from "next/router";

export default function Home({ adobeAPIKey, adobeAPISecret }) {
  const [connected, setconnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const redirectUrl = "https://aspekto.vercel.app";
  const crypto = require("crypto");

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
