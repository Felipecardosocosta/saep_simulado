import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'


import axios from 'axios'





const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()


    const [isModalOpen, setIsModalOpen] = useState(false)


    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/login', {
                email, senha: password
            })


            if (response.data.length === 0) {
                alert('Usuário não encontrado. Verifique o email e senha');
                return;
            }


            alert('Usuário logado.');

            navigate('/veiculos')
        } catch (error) {
            console.error('Erro ao verificar usuário', error)
            alert('Erro no servidor. Tente novamente mais tarde.');
        }
    }



    return (



        <div className='flex min-h-screen bg-gray-100'>


            <div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg'>
                <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>

                <form onSubmit={handleLogin} className='space-y-4'>
                    <fieldset>
                        <label htmlFor='email' className='block text-sm font-medium mb-1'>Email</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </fieldset>

                    <fieldset>
                        <label htmlFor='password' className='block text-sm font-medium mb-1'>Senha:</label>
                        <input
                            type='password'
                            id='password'
                            // minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </fieldset>

                    <button
                        type='submit'
                        className='w-full bg-cyan-700 text-white p-2 rounded-lg hover:bg-cyan-800 transition-colors'>
                        Entrar
                    </button>

                </form>

                <div className='flex justify-between mt-4 text-sm'>
                    <button onClick={() => toast.info('Funcionalidade em desenvolvimento')} className='text-blue-600 hover:underline cursor-pointer'>
                        Esqueceu sua senha?
                    </button>

                    <button onClick={() => setIsModalOpen(true)} className='text-blue-600 hover:underline cursor-pointer'>
                        Criar Conta
                    </button>
                </div>


            </div>
        </div>
    )
}

export default Login