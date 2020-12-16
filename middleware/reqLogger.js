const User = require('../models/User')
const Log = require('../models/Log')

const logger = async function(req, res, next){
    try {
        const userToken = req.user.tokens[req.user.tokens.length - 1].token
        const userEmail = req.user.email

        const addLog = {
            route: req.url,
            method: req.method,
            date: Date.now()
        }
        const foundLog = await Log.findOne({startToken: userToken})

        if(foundLog){
            foundLog.logs.push(addLog)
            res.send(foundLog)
        }else{
            const newLog = new Log({
                userEmail: userEmail,
                startTime: Date.now(),
                startToken: userToken
            })

            newLog.logs.push(addLog)
            res.send(newLog)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    logger
}