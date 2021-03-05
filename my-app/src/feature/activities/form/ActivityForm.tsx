import React,{FormEvent, useContext, useEffect, useState} from 'react'
import { Button, Form, Grid, GridColumn, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field} from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/form/categoryOptionsts';
import {combineValidators, composeValidators, hasLengthBetween, hasLengthGreaterThan, isRequired} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';


const validate=combineValidators({

    title:isRequired({message:'Event title is requied'}),
    category: isRequired('Category'),
    description: composeValidators(isRequired('description'),
    hasLengthGreaterThan(4)({message:'Description needs to be at least 5 charachters'}))(),
    city:isRequired('City'),
    date:isRequired('Date'),
    venue:isRequired('Venue')


})


interface DetailsParams
{
    id:string
}

export const ActivityForm:React.FC<RouteComponentProps<DetailsParams>> = ({history,match}) => {

    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;
    // const activityStore= useContext(ActivityStore);
    const {createActivity,editActivity,submitting,selectedActivity:initialFormState,LoadActivity,clearActivity}= activityStore;

    useEffect(()=>{
        if(match.params.id && activity.id.length ===0)
        {
            LoadActivity(match.params.id).then(
                ()=> initialFormState && setActivity(initialFormState));
        }
        return () =>{
            clearActivity();
        }
    },[LoadActivity,clearActivity,match.params.id,initialFormState]);
    // OLD code 
    const [activity,setActivity]=useState<IActivity>({
        id:'',
        title:'',
        category:'',
        date:'',
        city:'',
        venue:'',
        description:'' ,
        attendees:[],
        isGoing:false,
        isHost:false,
    });

    const handleInputChange=(event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const{name,value} =event.currentTarget;
        setActivity({...activity,[name]:value});
    };


    const handleFinalFormSubmit = (values:any)=>{
        if(activity.id.length ===0)
        {
            let newActivity={
                ...activity,
                id:uuid()
            }
            createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`));
        }
        else{
            editActivity(activity).then(()=>history.push(`/activities/${activity.id}`));
        }
        console.log(values);
    }

    return (
        <Grid>
            <GridColumn width={10}>
            <Segment clearing>
                <FinalForm
                validate={validate}
                onSubmit={handleFinalFormSubmit}
                initialValues={activity}
                render={({handleSubmit, invalid,pristine})=> (
                <Form onSubmit={handleSubmit}>
                <Field component={TextInput}  name='title' placeholder='Title' value={activity.title} />
                <Field component={TextAreaInput} rows={3} name='description' placeholder='Description' value={activity.description} />
                <Field component={SelectInput} options={category} name='category' placeholder='Catgeory' value={activity.category}/>
                <Field component={TextInput} type='Date' name='date'  placeholder='Date' value={activity.date} />
                <Field component={TextInput} name='city' placeholder='City' value={activity.city}/>
                <Field component={TextInput} name='venue' placeholder='Venue' value={activity.venue}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' disabled={invalid || pristine}/>
                <Button floated='right' type='button' content='Cancel' onClick={()=> history.push('/activities')}/>
            </Form>
                )}/>
        </Segment>
            </GridColumn>
        </Grid>
      
    );
}
export default observer(ActivityForm);