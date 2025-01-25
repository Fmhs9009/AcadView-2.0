

const Login = () => {
  return (
    <>
      <form action="#">
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">password:</label>
        <input type="password" />
        <input type="submit" name="Login" id="Login" value={"Login"} />
      </form>
    </>
  )
}

export default Login