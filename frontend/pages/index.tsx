import { generateRandomPassword } from "@/helpers/generateRandomPassword";
import { validatePassword } from "@/helpers/validateRandomPassword";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState('')
  const [useLetters, setUseLetters] = useState(true)
  const [useDigits, setUseDigits] = useState(false)
  const [usePunctuation, setUsePunctuation] = useState(false)
  const [viewCount, setViewCount] = useState(5)
  const [viewCountError, setViewCountError] = useState(false)
  const [passLength, setPassLength] = useState(10)
  const [passLengthError, setPassLengthError] = useState(false)
  const [expirationDateInSeconds, setExpirationDateInSeconds] = useState(30)
  const [dateError, setDateError] = useState(false)
  const [sendedPassword, setSendedPassword] = useState('')
  const [sendedPasswordError, setSendedPasswordError] = useState(false)

  const handleFinish = async (ignoreErrors = false) => {
    setResult('')
    if (!expirationDateInSeconds) {
      setDateError(true)
    }

    if (!passLength) {
      setPassLengthError(true)
    }

    if (!viewCount) {
      setViewCountError(true)
    }

    const validation = validatePassword({ passLength, useDigits, useLetters, usePunctuation, sendedPassword })
    if (!ignoreErrors && Object.values(validation).includes(false)) {
      setSendedPasswordError(true)
    }

    if (!ignoreErrors && (dateError || passLengthError || viewCountError || sendedPasswordError)) {
      return
    }
    try {
      const { data } = await axios.post('https://1z6xhcwoca.execute-api.us-east-1.amazonaws.com/pwd', {
        "use_letters": useLetters,
        "use_digits": useDigits,
        "use_punctuation": usePunctuation,
        "pass_length": passLength,
        "pass_view_limit": viewCount,
        "expiration_in_seconds": expirationDateInSeconds,
        "sended_password": sendedPassword
      })
      setResult(`${window.location.href}${data.pwd_id}`)
    } catch (error) {
      console.error('oops')
    }
  }

  const backendGenerateHandle = async () => {
    setSendedPassword('')
    await handleFinish(true)
  }

  const handleGeneratePassword = () => {
    if (!useDigits && !useLetters && !usePunctuation) {
      return
    }
    setSendedPassword(generateRandomPassword({
      passLength, useDigits, useLetters, usePunctuation
    }))
  }


  const inputStyle = "shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
  const inputErrorStyle = "shadow appearance-none border rounded border-red-500 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"

  return (
    <main className="flex min-h-screen flex-col font-mono p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between  text-sm lg:flex">
        <h1 className='text-2xl'>Totvs Test</h1>
      </div>
      <div className="p-24" >
        <p className="text-2xl ">Utilize este app para gerar uma nova senha</p>
        <div className="flex flex-col items-start justify-between w-80 pt-12">
          <p className="pb-6">Quais caracteres sua senha pode conter?</p>
          <div className="flex justify-between w-2/6">
            <label>Alfabeto</label>
            <input type="checkbox" defaultChecked={useLetters} onChange={(event) => setUseLetters(event.target.checked)} />
          </div>
          <div className="flex justify-between w-2/6">
            <label>Números</label>
            <input type="checkbox" defaultChecked={useDigits} onChange={(event) => setUseDigits(event.target.checked)} />
          </div>
          <div className="flex justify-between w-2/6">
            <label>Pontuação</label>
            <input type="checkbox" defaultChecked={usePunctuation} onChange={(event) => setUsePunctuation(event.target.checked)} />
          </div>
        </div>

        <p className="pt-8 pb-4">Qual o tamanho mínimo da senha?</p>
        <input type="number" value={passLength} onChange={(event) => setPassLength(+event.target.value)} className={`${viewCountError ? inputErrorStyle : inputStyle} w-18`}></input>

        <p className="pt-8 pb-4">Quantas vezas a senha poderá ser vista após ser salva?</p>
        <input type="number" value={viewCount} onChange={(event) => setViewCount(+event.target.value)} className={`${viewCountError ? inputErrorStyle : inputStyle} w-18`}></input>
        <div>

        </div>

        <p className="pt-8 pb-4">Por quanto tempo a senha ficará disponível ( em segundos )?</p>
        <input type="number" value={expirationDateInSeconds} onChange={(event) => setExpirationDateInSeconds(+event.target.value)} className={`${dateError ? inputErrorStyle : inputStyle} w-18`}></input>

        <p className="pt-4">Se você desejar digitar a sua própria senha, utilize o campo abaixo, senão, deixe-o em branco</p>
        <input type="text" value={sendedPassword} onChange={(event) => {
          setSendedPassword(event.target.value)
          setSendedPasswordError(false)
        }} className={`${sendedPasswordError ? inputErrorStyle : inputStyle} w-80 mt-4`}></input>

        <div className="flex flex-wrap gap-2 mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={backendGenerateHandle}>Gerar a senha no backend</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGeneratePassword}>Ver a senha agora mesmo</button>
        </div>
        <div className="mt-4">
          <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => handleFinish()}>Salvar</button>
        </div>
        {result ? <p className="mt-4">Sua senha está disponível para ser acessada. <a className="text-blue-600 italic " href={result} target='_blank'>clique aqui</a> para acessa-la </p> : <></>}
      </div>
    </main>
  )
}
