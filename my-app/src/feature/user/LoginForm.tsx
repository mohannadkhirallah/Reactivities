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
    password:isRequired('password')
})

export const LoginForm = () => {
    const rootStore= useContext(RootStoreContext);
    const {login} = rootStore.userStore;
    

    return (
        <FinalForm onSubmit={(values:IUserFormValues)=>login(values).catch(error=>({
            [FORM_ERROR]:error
        }))}
        validate={validate}
        
        render ={({handleSubmit,submitting,form,submitError,invalid,pristine,dirtySinceLastSubmit})=>(
            <Form onSubmit={handleSubmit} error >
                <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center'></Header>
                <Field name='email' component={TextInput} placeholder="Email" />
                <Field name="password" component={TextInput} type="password" placeholder="Password"/>
                {submitError && !dirtySinceLastSubmit && (<ErrorMessageViewer text='Invalid email or password' error={submitError}/>)}
                <br/>
                <Button disabled={invalid && !dirtySinceLastSubmit||pristine} loading={submitting} positive content="Login" color='teal' fluid/>
                
            </Form>

        )}
        />

    );
};
export default LoginForm
