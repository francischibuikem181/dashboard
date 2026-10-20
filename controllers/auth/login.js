const session = require('express-session');
const pool = require('../../config/database')
const bcypt = require('bcrypt')
async function loginUser(req, res) {
    return res.send('hi from controller regular function');
}


const signupUser = async (req,res)=>{
return res.send('hi from controller arrow function');
}


class AuthFunctions{
async forgotpwd(req, res) {
return res.send('hi from controller class method')
 }   
}
class Getlogin{
    async login (req,res){
      
        return res.render('login')
    }
} 


class forLoginPost{
    async login(req, res){
        try {
            const {email, password} = req.body
            const result = await pool.query(
                `SELECT * FROM users WHERE email = $1`, [email],
            )
            if(result.rows.length === 0){
                return res.send('account not found signu first')
            }  
            let data = result.rows[0]
            const Cresult = await bcypt.compare(password, data.password)
            if(!Cresult){
                return res.send('password dosent match')
            }else{
                const user = {
                    id: data.id,
                    name: data.name,
                    email: data.email,

                }
                req.session.user = user
                console.log(req.session.user)
                // console.log('welcome user')
                res.redirect('/dashboard')
            }
            
        } catch (error) {
            
        }
    }
}






module.exports ={
    loginUser,
     signupUser,
     getLoginFirst: new Getlogin(),
    authClass: new AuthFunctions(),
    loginFirst: new forLoginPost()
}