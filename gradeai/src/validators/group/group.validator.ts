import {body, param} from 'express-validator'

export class GroupValidator {
  public static create = () => [
    body('name', 'Guruh nomi kiritilishi shart').notEmpty(),
    body('name', 'Guruh nomi matn bo\'lishi kerak').isString(),
  ]

  public static update = () => [
    param('id', 'Guruh ID noto\'g\'ri').isMongoId(),
    body('name', 'Guruh nomi matn bo\'lishi kerak').optional().isString(),
    body('status', 'Status faqat open yoki closed bo\'lishi mumkin').optional().isIn(['open', 'closed']),
  ]

  public static getById = () => [
    param('id', 'Guruh ID noto\'g\'ri').isMongoId(),
  ]

  public static memberAction = () => [
    param('id', 'Guruh ID noto\'g\'ri').isMongoId(),
    param('student_id', 'Student ID noto\'g\'ri').isMongoId(),
  ]
}
