import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react'
import {Form as FinalForm,Field} from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header, Label } from 'semantic-ui-react'
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import ErrorMessageViewer from '../../app/common/form/ErrorMessageViewer';
import TextInput from '../../app/common/form/TextInput'
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';


const validate =combineValidators({
    email:isRequired('email'),
    password:isRequired('password'),
    username:isRequired('username'),
    displayname:isRequired('displayname')
})

export const RegisterForm = () => {
    const rootStore= useContext(RootStoreContext);
    const {register} = rootStore.userStore;
    
    return (
        <FinalForm onSubmit={(values:IUserFormValues)=>register(values).catch(error=>({
            [FORM_ERROR]:error
        }))}

        validate={validate}
        render ={({handleSubmit,submitting,form,submitError,invalid,pristine,dirtySinceLastSubmit})=>(
            <Form onSubmit={handleSubmit} error >
                <Header as='h2' content='Signup to Reactivities' color='teal' textAlign='center'></Header>
                <Field name='username' component={TextInput} placeholder="Username" />
                <Field name='displayname' component={TextInput} placeholder="Display Name" />
                <Field name='email' component={TextInput} placeholder="Email" />
                <Field name="password" component={TextInput} type="password" placeholder="Password"/>
                {submitError && !dirtySinceLastSubmit && (<ErrorMessageViewer  error={submitError}/>)}
                <br/>
                <Button disabled={invalid && !dirtySinceLastSubmit||pristine} loading={submitting} positive content="Register" color='teal' fluid/>
                
            </Form>

        )}
        />

    );
};
export default RegisterForm
