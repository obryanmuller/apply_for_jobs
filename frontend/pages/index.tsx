import { generateRandomPassword } from "@/helpers/generateRandomPassword";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState('')
  const [useLetters, setUseLetters] = useState(false)
  const [useNumbers, setUseNumbers] = useState(false)
  const [usePunctuations, setUsePunctuations] = useState(false)
  const [viewCount, setViewCount] = useState('')
  const [expirationDateInSeconds, setExpirationDateInSeconds] = useState('')
  const [sendedPassword, setSendedPassword] = useState('')

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
            <input type="checkbox" onChange={(event) => setUseLetters(event.target.checked)} />
          </div>
          <div className="flex justify-between w-2/6">
            <label>Números</label>
            <input type="checkbox" onChange={(event) => setUseNumbers(event.target.checked)} />
          </div>
          <div className="flex justify-between w-2/6">
            <label>Pontuação</label>
            <input type="checkbox" onChange={(event) => setUsePunctuations(event.target.checked)} />
          </div>
        </div>

        <p className="pt-8 pb-4">Quantas vezas a senha poderá ser vista após ser salva?</p>
        <input type="number" className={`${inputStyle} w-18`}></input>
        <div>

        </div>
        <p className="pt-8 pb-4">Por quanto tempo a senha ficará disponível ( em segundos )?</p>

        <input type="number" className={`${inputStyle} w-18`}></input>

        <p className="pt-4">Se você desejar digitar a sua própria senha, utilize o campo abaixo, senão, deixe-o em branco</p>
        <input type="text" className={`${inputStyle} w-80 mt-4`}></input>
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Gerar a senha no backend</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ver a senha agora mesmo</button>
        </div>
        <div className="mt-4">
          <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => setResult(generateRandomPassword(20, true, true, true))}>Salvar</button>
        </div>
        <p className="m-4" >{result}</p>
      </div>
    </main>
  )
}
