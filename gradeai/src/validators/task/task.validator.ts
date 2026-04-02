import {body, param, query} from 'express-validator'

export class TaskValidator {
  public static create = () => [
    body('name', 'Vazifa nomi kiritilishi shart').notEmpty(),
    body('name', 'Vazifa nomi matn bo\'lishi kerak').isString(),
    body('group', 'Guruh tanlanishi shart').notEmpty(),
    body('group', 'Guruh ID noto\'g\'ri').isMongoId(),
    body('deadline', 'Deadline kiritilishi shart').notEmpty(),
    body('deadline', 'Deadline sana formatida bo\'lishi kerak').isISO8601(),
  ]

  public static update = () => [
    param('id', 'Vazifa ID noto\'g\'ri').isMongoId(),
    body('name', 'Vazifa nomi matn bo\'lishi kerak').optional().isString(),
    body('topic', 'Mavzu matn bo\'lishi kerak').optional().isString(),
    body('context', 'Context matn bo\'lishi kerak').optional().isString(),
    body('deadline', 'Deadline sana formatida bo\'lishi kerak').optional().isISO8601(),
  ]

  public static getById = () => [
    param('id', 'Vazifa ID noto\'g\'ri').isMongoId(),
  ]

  public static getAll = () => [
    query('group', 'Guruh ID noto\'g\'ri').optional().isMongoId(),
  ]
}
