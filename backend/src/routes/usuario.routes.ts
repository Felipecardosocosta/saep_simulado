import type { Request, Response } from "express";
import type { Usuario } from "@prisma/client";
import { prisma } from "../prisma";

import { Router } from "express";


export const authRouter = Router()

authRouter.post("/cadastrar", async (req: Request, res: Response) => {  
        try {
            const dadosUsuario = req.body as Usuario
            const usuarioCriado = await prisma.usuario.create({
            data: {
                email: dadosUsuario.email || "",
                senha: dadosUsuario.senha || "",
                nome: dadosUsuario.nome || ""
            }
        })

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                usuario: usuarioCriado
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    })

  authRouter.post("/logar",async (req: Request, res: Response)=> {
        try {
            const dadosUsuario = req.body as Partial<Usuario>

            const dadosLogin = await prisma.usuario.findUnique({
                where: {
                    email: dadosUsuario.email || "",
                    senha: dadosUsuario.senha || ""
                }
            })


            return res.status(200).json({
                message: "Usuário autenticado com sucesso!",
                usuario: dadosLogin
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    })

