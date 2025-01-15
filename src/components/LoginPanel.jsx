/* eslint-disable react/prop-types */
function LoginPanel({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  SocialIcons,
  CCLogo,
}) {
  return (
    <div className="flex-col justify-center columns-1 items-center min-h-screen">
      {/* Logo Section */}
      <div className="h-70 w-70 mx-auto sm:w-96 sm:h-96">
        <div className="aspect-square">
          <img src={CCLogo} className="rounded-full" alt="Logo" />
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white p-6 pb-10 w-96 mx-auto rounded-lg border-2 border-black focus:outline-none placeholder">
        <form onSubmit={handleLogin} className="text-center">
          <h2 className="text-2xl text-center font-bold">Admin Login</h2>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="sm:w-90 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none placeholder text-2xl"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sm:w-90 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none placeholder text-2xl"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 py-3 w-[100%] text-center rounded border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 text-2xl font-bold"
          >
            <p className="font-bold text-lg text-white">Log In</p>
          </button>
        </form>
      </div>
      <SocialIcons />
    </div>
  );
}

export default LoginPanel;