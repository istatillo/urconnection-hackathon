import {body, param} from 'express-validator'

export class ComplaintValidator {
  public static getById = () => [
    param('id', 'Shikoyat ID noto\'g\'ri').isMongoId(),
  ]

  public static override = () => [
    param('id', 'Shikoyat ID noto\'g\'ri').isMongoId(),
    body('new_score', 'Yangi baho kiritilishi shart').notEmpty(),
    body('new_score', 'Baho 0 dan 10 gacha bo\'lishi kerak').isFloat({min: 0, max: 10}),
  ]
}
