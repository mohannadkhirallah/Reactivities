import React from 'react'
import { FieldRenderProps, Form as FinalForm } from 'react-final-form'
import { FormField, FormFieldProps, Label , Form} from 'semantic-ui-react'


interface IProps extends FieldRenderProps<string,HTMLElement>,FormFieldProps
{

}

export const TextInput:React.FC<IProps> = ({input,width,type, placeholder, meta:{touched,error} }) => {

 return( 
    <Form.Field error={touched && !!error} type={type} width={width}>
     <input {...input} placeholder={placeholder}>
     </input>
     {touched && error && (
        <Label basic color='red'>{error}</Label>
     )}
    </Form.Field>
 )
};

export default TextInput;
