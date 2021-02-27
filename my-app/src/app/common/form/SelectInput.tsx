import React from 'react'
import { FieldRenderProps, Form as FinalForm } from 'react-final-form'
import { FormField, FormFieldProps, Label , Form, Select} from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string,HTMLElement>,FormFieldProps
{

}
export const SelectInput:React.FC<IProps> = ({
    input,
    width,
    options,
    placeholder,
    meta:{touched,error}

}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
        <Select value={input.value}
        onChange={(e,data)=> input.onChange(data.value)}
        placeholder={placeholder}
        options={options}/>
        {touched && error && (
           <Label basic color='red'>{error}</Label>
        )}
       </Form.Field>
    )
}