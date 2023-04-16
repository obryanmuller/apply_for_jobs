import { generateRandomPassword } from "@/helpers/generateRandomPassword";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState('')

  return (
    <main className="flex min-h-screen flex-col  p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className='text-lg'>Totvs Test</h1>
      </div>
      <div className="p-24" >
        <p className="text-center text-2xl">Utilize este app para gerar uma nova senha</p>
        <div className="flex flex-col items-start justify-between w-80 pt-12">
          <p className="pb-6">Quais caracteres sua senha pode conter?</p>
          <div className="flex justify-between w-3/6">
            <label>Alfabeto</label>
            <input type="checkbox" value='' />
          </div>
          <div className="flex justify-between w-3/6">
            <label>Números</label>
            <input type="checkbox" value='' />
          </div>
          <div className="flex justify-between w-3/6">
            <label>Pontuação</label>
            <input type="checkbox" value='' />
          </div>
        </div>

        <p className="pt-8 pb-4">Quantas vezas a senha poderá ser vista após ser salva?</p>
        <input type="number" className="w-12 border-cyan-950 border-1 rounded-sm"></input>

        <p className="pt-4">Se você desejar digitar a sua própria senha, utilize o campo abaixo, senão, deixe-o em branco</p>
        <input type="text" className="w-64 mt-4 border-cyan-950 border-1 rounded-sm"></input>
        <div>
          <button className="bg-green-500 text-white rounded-md mt-4 p-2">Quero gerar a senha no backend</button>
          <button className="bg-slate-300 rounded-md ml-4 p-2">Quero ver a senha agora mesmo</button>
        </div>
        <div>
          <button className="bg-slate-300 rounded-md mt-4 p-2 " onClick={() => setResult(generateRandomPassword(20, true, true, true))}>Salvar</button>
        </div>
        <p className="m-4" >{result}</p>
      </div>
    </main>
  )
}
