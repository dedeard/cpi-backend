import Joi from 'joi'
import { UploadedFile } from 'express-fileupload'
import { fromBuffer } from 'file-type'

export const onlyImageLookup = (): Joi.ExternalValidationFunction => async (file?: UploadedFile) => {
  if (file) {
    const mime = await fromBuffer(file.data)
    if (!['jpg', 'png', 'gif', 'webp'].includes(mime?.ext || '')) {
      throw new Joi.ValidationError(
        '"Image" format must be [jpg, png, gif, webp].',
        [{ message: '"Image" format must be [jpg, png, gif, webp].', path: ['image'], type: 'string' }],
        file,
      )
    }
  }
}
