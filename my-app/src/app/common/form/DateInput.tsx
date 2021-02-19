import React from 'react'
import { FieldRenderProps, Form as FinalForm } from 'react-final-form'
import { DateTimePicker } from 'react-widgets'
import { FormField, FormFieldProps, Label , Form, Select} from 'semantic-ui-react'


interface IProps extends FieldRenderProps<Date,HTMLElement>,FormFieldProps
{

}
export const DateInput:React.FC<IProps> = ({
    input,
    width,
    placeholder,
    meta:{touched,error},
    id,
    ...rest
}) => {
    return (
        <div></div>
    //     <Form.Field error={touched && !!error} width={width}>
    //         <DateTimePicker 
    //         placeholder={placeholder}
    //         value={input.value || null}
    //         onChange={input.onChange}
    //         {...rest}
    //         />
    //     {touched && error && (
    //        <Label basic color='red'>{error}</Label>
    //     )}
    //    </Form.Field>
    )
}
