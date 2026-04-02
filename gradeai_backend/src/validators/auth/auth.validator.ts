import {body} from 'express-validator'

import {SubjectConstants} from '../../constants/subject.constants'

export class AuthValidator {
  public static signUp = () => [
    body('name', 'Ism kiritilishi shart').notEmpty(),
    body('name', 'Ism matn bo\'lishi kerak').isString(),
    body('phone', 'Telefon raqam kiritilishi shart').notEmpty(),
    body('phone', 'Telefon raqam noto\'g\'ri formatda').isMobilePhone('any'),
    body('subject', 'Fan tanlanishi shart').notEmpty(),
    body('subject', 'Noto\'g\'ri fan tanlangan').isIn(Object.values(SubjectConstants)),
    body('gender', 'Jins tanlanishi shart').notEmpty(),
    body('gender', 'Jins faqat male yoki female bo\'lishi mumkin').isIn(['male', 'female']),
    body('password', 'Parol kiritilishi shart').notEmpty(),
    body('password', 'Parol kamida 8 belgidan iborat bo\'lishi kerak').isLength({min: 8, max: 32}),
  ]

  public static login = () => [
    body('phone', 'Telefon raqam kiritilishi shart').notEmpty(),
    body('phone', 'Telefon raqam noto\'g\'ri formatda').isMobilePhone('any'),
    body('password', 'Parol kiritilishi shart').notEmpty(),
    body('password', 'Parol kamida 8 belgidan iborat bo\'lishi kerak').isLength({min: 8, max: 32}),
  ]

  public static updatePassword = () => [
    body('current_password', 'Joriy parol kiritilishi shart').notEmpty(),
    body('current_password', 'Joriy parol matn bo\'lishi kerak').isString(),
    body('new_password', 'Yangi parol kiritilishi shart').notEmpty(),
    body('new_password', 'Yangi parol kamida 8 belgidan iborat bo\'lishi kerak').isLength({min: 8, max: 32}),
  ]

  public static update = () => [
    body('name', 'Ism matn bo\'lishi kerak').optional().isString(),
    body('subject', 'Noto\'g\'ri fan tanlangan').optional().isIn(Object.values(SubjectConstants)),
    body('phone', 'Telefon raqam noto\'g\'ri formatda').optional().isMobilePhone('any'),
  ]
}
