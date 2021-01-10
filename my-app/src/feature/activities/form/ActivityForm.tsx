import React,{FormEvent, useContext, useState} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface Iprops{
    activity : IActivity;
}

export const ActivityForm:React.FC<Iprops> = ({ activity:initialFormState }) => {

    const activityStore= useContext(ActivityStore);
    const {createActivity,editActivity,submitting,cancelFormOpen}= activityStore;
    const initializeForm = ()=>
    {
        if(initialFormState)
        {
            return initialFormState;
        }
        else
        {
            return {
                id:'',
                title:'',
                category:'',
                date:'',
                city:'',
                venue:'',
                description:''
            }
        }

    };

    const [activity,setActivity]=useState<IActivity>(initializeForm);

    const handleInputChange=(event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const{name,value} =event.currentTarget;
        setActivity({...activity,[name]:value});
    };

    const handleSubmit =()=>{
        if(activity.id.length ===0)
        {
            let newActivity={
                ...activity,
                id:uuid()
            }
            createActivity(newActivity);
        }
        else{
            editActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title}/>
                <Form.TextArea onChange={handleInputChange} name='description' rows={2} placeholder='Description' value={activity.description} />
                <Form.Input onChange={handleInputChange} name='category' placeholder='Catgeory' value={activity.category}/>
                <Form.Input onChange={handleInputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date} />
                <Form.Input onChange={handleInputChange} name='city' placeholder='City' value={activity.city}/>
                <Form.Input onChange={handleInputChange} name='venue' placeholder='Venue' value={activity.venue}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit'/>
                <Button floated='right' type='button' content='Cancel' onClick={cancelFormOpen}/>
            </Form>
        </Segment>
    );
}
export default observer(ActivityForm);