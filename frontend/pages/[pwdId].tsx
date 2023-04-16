import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function GetPwd() {
  const [message, setMessage] = useState('')

  const router = useRouter()
  const pwdId = router.query.pwdId

  useEffect(() => {
    if (!pwdId) return
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`https://1z6xhcwoca.execute-api.us-east-1.amazonaws.com/pwd/${pwdId}`)
        setMessage(`Sua senha é: ${data.pwd} e você pode visualiza-la mais ${data.view_count} vez(es)`)
      } catch (error) {
        setMessage('Essa senha não existe, ou já expirou')
      }
    }

    fetchData()
  }, [pwdId])
  return (
    <main className="flex min-h-screen flex-col font-mono p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between  text-sm lg:flex">
        <h1 className='text-2xl'>Totvs Test</h1>
      </div>
      <div className="p-24" >
        <p className="text-2xl ">{message}</p>

      </div>
    </main>
  )
}
