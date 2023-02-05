export const getStaticProps = async (code) => {
  const the_code = code;
  try {
    const result = await axios.post(
      `https://ims-na1.adobelogin.com/ims/token?grant_type=authorization_code&client_id=${adobeAPIKey}&client_secret=${adobeAPISecret}&code=${code}`
    );
    setToken(result.data.access_token);
  } catch (error) {
    setResponse("Login failed!");
  }
  return {
    props: {
      the_code,
    },
  };
};

export default function Callback({ code }) {
  const [response, setResponse] = useState(null);
  const [token, setToken] = useState(null);
  const redirectUrl = "https://aspekto.vercel.app";

  const handleLogin = async () => {
    window.location.href = `https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeAPIKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=${redirectUrl}`;
  };

  const handleCallback = async (code) => {
    try {
      const result = await axios.post(
        `https://ims-na1.adobelogin.com/ims/token?grant_type=authorization_code&client_id=${adobeAPIKey}&client_secret=${adobeAPISecret}&code=${code}`
      );
      setToken(result.data.access_token);
    } catch (error) {
      setResponse("Login failed!");
    }
  };

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `https://ims-na1.adobelogin.com/ims/userinfo?client_id=${adobeAPIKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(JSON.stringify(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!response ? (
        <div>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>{response}</p>
          <button onClick={handleProfile}>Get Profile</button>
        </div>
      )}
    </div>
  );
}
