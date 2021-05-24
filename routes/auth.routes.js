import {Router} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import User from '../models/User.js'

const router = Router()

router.post(
    '/register',
    [
        check('login', 'Минимальная длина логина 4').isLength({ min: 4 }),
        check('password', 'Минимальная длина пароля 6').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректные данные при регистрации'
            })
        }

        const {login, password} = req.body

        const candidate = await User.findOne({ login })

        if (candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ login, password: hashedPassword })

        await user.save()

        res.status(201).json({ message: 'Пользователь создан' })
        
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post(
    '/login',
    [
        check('login', 'Введите логин').exists(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректные данные при входе в систему'
            })
        }

        const {login, password} = req.body

        const user = await User.findOne({ login })

        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.json({ token, userId: user.id })

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

export default router