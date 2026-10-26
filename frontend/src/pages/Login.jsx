import '../App.css'

function Login({onEntrar}) {
 

  return (
    <div>
      <h1>Celc Financias</h1>
      
      <h2 className="Login-title">Login</h2>
      <div className="Login-form">
        <input type="text" placeholder="Usuario"/>
        <br/>

        <input type="password" placeholder="senha"/>
        <br/>

        <button onClick={onEntrar}>Entrar</button>
      </div>
    </div>
  )
}
export default Login