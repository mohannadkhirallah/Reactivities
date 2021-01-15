import React,{FormEvent, useContext, useEffect, useState} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
interface DetailsParams
{
    id:string
}

export const ActivityForm:React.FC<RouteComponentProps<DetailsParams>> = ({history,match}) => {

    const activityStore= useContext(ActivityStore);
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

    const [activity,setActivity]=useState<IActivity>({
        id:'',
        title:'',
        category:'',
        date:'',
        city:'',
        venue:'',
        description:'' 
    });

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
            createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`));
        }
        else{
            editActivity(activity).then(()=>history.push(`/activities/${activity.id}`));
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
                <Button floated='right' type='button' content='Cancel' onClick={()=> history.push('/activities')}/>
            </Form>
        </Segment>
    );
}
export default observer(ActivityForm);