const pool = require('../../config/database')
const bcypt = require('bcrypt')
class forSignupPost{
    async signupPost(req, res){
        try {
            const { name, email, password } = req.body;
            const result = await pool.query(
                `SELECT email FROM users WHERE email = $1`,
                [email],
            )
            if (result.rows.length > 0){
                return res.send('account already exist please login')
            }

            const hash = await bcypt.hash(password, 10)
            await pool.query(
                `INSERT INTO users (name, email, password) VALUES ($1,$2,$3)`, [name, email, hash]
            )
            res.redirect('/login-user')
        } catch (error) {
            
        }
    }
}

module.exports = {
    forSignupFirst: new forSignupPost()
}