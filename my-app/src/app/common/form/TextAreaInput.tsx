import React from 'react'
import { FieldRenderProps, Form as FinalForm } from 'react-final-form'
import { FormField, FormFieldProps, Label , Form} from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string,HTMLElement>,FormFieldProps
{

}

export const TextAreaInput: React.FC<IProps> = ({input, type, width, placeholder,rows , meta:{touched,error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
        <textarea rows={rows} {...input} placeholder={placeholder}/>
        {touched && error && (
           <Label basic color='red'>{error}</Label>
        )}
       </Form.Field>
    )
}
export default TextAreaInput;