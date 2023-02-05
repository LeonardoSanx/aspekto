import React, { useState } from "react";
import axios from "axios";
import crypto from "crypto";

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

export default function Home({ adobeAPIKey, adobeAPISecret }) {
  const [response, setResponse] = useState(null);
  const [token, setToken] = useState(null);
  const redirectUrl = "https://aspekto.vercel.app";

  async function getHealthStatus() {
    // generate a random string for the state parameter
    const state = crypto.randomBytes(32).toString("hex");
    // store the state parameter in the user's session
    sessionStorage.setItem("state", state);

    console.log(state);
    axios
      .get(
        `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeAPIKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=${redirectUrl}&state=${state}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <main className="pt-24 flex flex-col w-full items-center min-h-screen">
      <button
        className="flex py-2 px-6 text-gray-700 justify-center border-gray-700 border cursor-pointer text-sm rounded-xl shadow-md hover:text-gray-900 focus:border-gray-900"
        onClick={
          async () => getHealthStatus()
          // , getHealthStatus()
        }
      >
        status do client ID
      </button>
    </main>
  );
}
