import { log } from 'console'
import { growdevers } from "./dados.js";

export const logMiddlewares = (req, res, next)=>{
    console.log("middleware inserido");
    
    next()
}
export const logResMiddleware = (req, res, next)=>{
    console.log(req.query);
    console.log(req.hostname);
    console.log(req.ip);
    console.log(req.body);
    
    next()
    
}
export const validateGrowdeverMiddleware = (req, res, next)=>{
    try{
        const body= req.body
        if(!body.nome){
                return res.status(400).send({
                    ok: false,
                    mensagem: "nome não informado"
                })
            }
            if(!body.email){
                return res.status(400).send({
                    ok: false,
                    mensagem: "email não informado"
                })
            }
            if(!body.idade){
                return res.status(400).send({
                    ok: false,
                    mensagem: "idade não informada"
                })
            }
            if(Number(body.idade)<18){
                return res.status(400).send({
                    ok: false,
                    mensagem: "idade menor que 18 anos"
                })
            }
            if(body.matriculado === null || body.matriculado === undefined){
                return res.status(400).send({
                    ok: false,
                    mensagem: "estado da matricula não informado"
                })
            }
            next()
    }
    catch(error){
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        })
    }
}
export const logBody = (req, res, next)=>{
    console.log(req.body);
    next()
    
}
export const validateIfIsRegistered = (req, res, next)=>{
    try{
        const {id}= req.params
        
        const growdever = growdevers.find(item=> item.id === id)
        if(!growdever){
            return next()
            
        }
        if(!growdever.matriculado){
            return res.status(400).send({
                ok: false,
                mensagem: "aluno não matriculado, não é possível atualizar."
            })
        }
        next()
    }
    catch(error){
        return res.status(500).send({
            ok: false, 
            mensagem: error.toString()
        })
    }
}
// (antes) REQUEST ---> ROTA DA API
// (com middleware) REQUEST ---> MIDDLEWARE ---> ROTA DA API