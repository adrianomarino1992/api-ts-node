import { IValidationResult } from "../validatorHandler";
import ValidationException from "../../exceptions/validationException";

export default function ValidationResultHandler(results : IValidationResult[]) : void
{
    throw new ValidationException(results);
}