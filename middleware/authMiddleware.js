import jwt from 'jsonwebtoken'
// import jwt_decode from 'jwt-decode'

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Пользователь не авторизован' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(jwt_decode(token))
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: 'Пользователь не авторизован' })
    }
}