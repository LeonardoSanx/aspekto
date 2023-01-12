// import Head from "next.head";
import { useState, useEffect } from "react";
import { server } from "../config";
import queryString from "query-string";

function Home({ adobeAPIKey, adobeAPISecret }) {
  const [connected, setconnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const redirectUri = "https://aspekto.vercel.app";
  const clientId = adobeAPIKey;
  const clientSecret = adobeAPISecret;

  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  async function getAccessToken() {
    const responseCode = await fetch(
      `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${clientId}&state=90cff02f-da33-46ec-985c-1f5cf2f9644a&response_type=code`
    );
    console.log(responseCode);
  }

  // Pegando o status do meu client ID
  async function getHealthStatus() {
    const responseHealth = await fetch(`https://lr.adobe.io/v2/health`, {
      headers: {
        "x-api-key": `${clientId}`,
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
        connect lightroom
      </button>

      <button
        className="flex py-2 px-6 text-gray-700 justify-center border-gray-700 border cursor-pointer text-sm rounded-xl shadow-md hover:text-gray-900 focus:border-gray-900"
        onClick={
          async () => (setconnected(true), getAccessToken())
          // , getHealthStatus()
        }
      >
        Get client authorization
      </button>
    </main>
  );
}

export default Home;

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
