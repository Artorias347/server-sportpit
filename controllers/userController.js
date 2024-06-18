const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

// Настройка nodemailer для отправки писем
const transporter = nodemailer.createTransport({
    service: 'gmail', // используем Gmail, можно заменить на другой сервис
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class UserController {
    // ... другие методы

    async resetPassword(req, res, next) {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.badRequest('Пользователь с таким email не найден'));
        }

        // Генерация токена для восстановления пароля
        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Отправка письма с ссылкой для восстановления пароля
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Восстановление пароля',
            text: `Перейдите по следующей ссылке для восстановления пароля: ${resetLink}`
        });

        return res.json({ message: 'Письмо для восстановления пароля отправлено' });
    }

    async changePassword(req, res, next) {
        const { token, newPassword } = req.body;
        let payload;

        try {
            payload = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return next(ApiError.badRequest('Неверный или истекший токен'));
        }

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));
        }

        const hashPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashPassword;
        await user.save();

        return res.json({ message: 'Пароль успешно изменен' });
    }
}

module.exports = new UserController();
