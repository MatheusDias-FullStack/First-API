import express from 'express'
import * as dotenv from 'dotenv'
import { growdevers } from './dados.js' 
import { randomUUID } from 'crypto'
import { logBody, logMiddlewares, logResMiddleware, validateGrowdeverMiddleware, validateIfIsRegistered} from './middlewares.js'
import cors from 'cors'
// permite que haja acesso ao codigo apartir do process.env
dotenv.config()
//

const app = express()
app.use(express.json())
app.use(cors())
app.use(logMiddlewares)

const porta= process.env.PORT
app.listen(porta, ()=>{
    console.log('O servidor está executando na porta ' + porta);
})
//  GET    /growdevers?idade=20
app.get("/growdevers", [logResMiddleware], (req, res)=>{
    try{
    // 1 entrada
    const {idade, nome, email, email_includes} = req.query
    //mesmo que const idade = req.query.idade. mas esta usando direto apropriedade idade dentro de req.query como variavel idade
    // 2 processamento
    let data = growdevers
    if(idade){
        data = data.filter(item=> item.idade >= Number(idade))
    }
    if(nome){
        data = data.filter(item=> item.nome.includes(nome))
    }
    if(email){
        dados= dados.filter(item=> item.email === email)
    }
    if(email_includes){
        data = data.filter(item=> item.email.includes(email_includes))
    }
    // 3 saida
    res.status(200).send({
        ok: true,
        mensagem: "Dados listados com sucesso",
        dados: data
    })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            ok:false,
            mensagem: error.toString()
        })
        
    }
})

app.post("/growdevers", [logBody, logResMiddleware, validateGrowdeverMiddleware], (req, res)=>{
    try{
    // 1 entrada 
    const body = req.body
    
    const newGrowdever = {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        idade: body.idade,
        matriculado: body.matriculado
    }
    // 2 processamento
        growdevers.push(newGrowdever)
    // 3 saida
    res.status(201).send({
        ok: true,
        mensagem: "growdever adicionado com sucesso",
        dados: growdevers
    })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            ok:false,
            mensagem: error.toString()
        })
        
    }   
})
app.get("/growdevers/:id", (req, res)=>{
    try{
    // 1 entrada
    const { id } = req.params;
    // 2 processamento
    const growdever = growdevers.find((item)=> item.id === id)
    if(!growdever){
        return res.status(404).send({
            ok:false,
            mensagem: "growdever não encontrado"
        })
    }
    // 3 saida
    res.status(200).send({
        ok:true,
        mensagem: "growdever encontrado",
        dados: growdever,
    })
    }
    catch(error){
        console.log();
        res.status(500).send({
            ok: true,
            mensagem: error.toString()
        })
        
    }
})
// PUT     /growdevers/:id
app.put("/growdevers/:id",[logBody, validateGrowdeverMiddleware, validateIfIsRegistered], (req, res)=>{
    try{
    // 1 entrada
    const {id}= req.params
    const {nome, email, idade, matriculado} = req.body
    // 2 processamento 
    let growdever = growdevers.find(item=> item.id === id)
    if(!growdever){
        return res.status(404).send({
            ok: false,
            mensagem: 'growdever não encontrado'
        })
    }
    growdever.nome = nome
    growdever.email = email
    growdever.idade = idade
    growdever.matriculado = matriculado
    // 3 saida
    res.status(200).send({
        ok: true, 
        mensagem: "growdever atualizado",
        dados: growdevers
    })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            ok:false, 
            mensagem: error.toString()
        })
    }       
})
// PATCH   /growdevers/:id - toggle matriculado
app.patch("/growdevers/matricula/:id", (req, res)=>{
    // 1 entrada
    const {id}= req.params
    // 2 processamento 
    const growdever = growdevers.find(item=> item.id === id)
    if(!growdever){
        return res.status(404).send({
            ok:false,
            mensagem: "growdever nao encontrado"
        })
    }
    growdever.matriculado = !growdever.matriculado
    // 3 saida
    res.status(200).send({
        ok:true, 
        mensagem: "matricula atualizada",
        dados: growdever
    })
})
app.patch("/growdevers/idade/:id", [logBody], (req, res)=>{
    // 1 entrada
    const {id}= req.params
    const {idade} = req.body
    // 2 processamento 
    const growdever = growdevers.find(item=> item.id === id)
    if(!growdever){
        return res.status(404).send({
            ok:false,
            mensagem: "growdever nao encontrado"
        })
    }
    growdever.idade = idade
    // 3 saida
    res.status(200).send({
        ok:true, 
        mensagem: "idade atualizada com sucesso",
        dados: growdevers
    })
})
app.delete("/growdevers/:id", (req, res)=>{
    const {id}= req.params

    const growdeverIndex = growdevers.findIndex(item=> item.id === id)
    if(growdeverIndex < 0){
        return res.status(404).send({
            ok: false,
            mensagem: "growdever nao encontrado"
        })
    }
    growdevers.splice(growdeverIndex, 1)

    res.status(200).send({
        ok: true, 
        mensagem: "growdever excluido",
        dados: growdevers
    })
})