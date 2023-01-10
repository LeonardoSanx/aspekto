// import Head from "next.head";
import { useState, useEffect } from "react";
import { server } from "../config";
function Home({ adobeAPIKey, adobeAPISecret }) {
  const [connected, setconnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const redirectUri = "https://focal.vercel.app";

  async function getHealthStatus() {
    const responseHealth = await fetch(`https://lr.adobe.io/v2/health`, {
      headers: {
        "x-api-key": `${adobeAPIKey}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(responseHealth.status);
    const responseAuth = await fetch(
      `https://ims-na1.adobelogin.com/ims/keys`,
      {
        // headers: {
        //   "x-api-key": `${adobeAPIKey}`,
        //   // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
      }
    );
    console.log(responseAuth);
  }

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    // Step 4: Exchange the authorization code for an access token
    if (code) {
      fetch("https://ims-na1.adobelogin.com/ims/token", {
        method: "POST",
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: adobeAPIKey,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const accessToken = res.access_token;
          console.log(`Your access token is: ${accessToken}`);
        })
        .catch((err) => {
          console.error("An error occurred:", err);
        });
    }
  }, []);

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

      <a
        href={`https://ims-na1.adobelogin.com/ims/authorize?client_id=${adobeAPIKey}&response_type=code&redirect_uri=${redirectUri}`}
      >
        Login with Adobe
      </a>
    </main>
  );
}

export default Home;

export const getStaticProps = async () => {
  require("dotenv").config();
  const adobeAPIKey = process.env.API_KEY;
  const adobeAPISecret = process.env.API_SECRET;
  return {
    props: {
      adobeAPIKey,
      adobeAPISecret,
    },
  };
};
