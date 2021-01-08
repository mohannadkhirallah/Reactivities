import React, { SyntheticEvent } from 'react'
import { Grid, GridColumn, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface IProps{
    activities:IActivity[];
    selectActivity:(id:string)=>void;
    selectedActivity:IActivity;
    editMode:boolean;
    setEditMode :(editMode:boolean)=> void;
    setSelectedActivity:(activity:IActivity |null) => void;
    createActivity : (activity:IActivity) =>void;
    editActivity : (activity :IActivity) => void;
    deleteActivity :(e:SyntheticEvent<HTMLButtonElement>, id:string) =>void;
    submitting: boolean;
    target:string;
}

export const ActivityDashboard:React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    editMode,
    setEditMode,
    setSelectedActivity
    ,createActivity,
    editActivity,
    deleteActivity,
    submitting,
    target
    }) => {
    return (
        <Grid>
            <Grid.Column width={10} >
                <ActivityList activities={activities} selectActivity={selectActivity}
                 deleteActivity ={deleteActivity} 
                 target = {target}
                 submitting ={submitting}/>
            </Grid.Column>
            <GridColumn width={6}>
                {selectedActivity && !editMode && (
                <ActivityDetails
                 activity={selectedActivity}
                 setEditMode={setEditMode}
                 setSelectedActivity ={setSelectedActivity}
                 ></ActivityDetails>
                )}
                {editMode &&  <ActivityForm
                key={selectedActivity && selectedActivity.id || 0}
                 setEditMode={setEditMode}
                 activity={selectedActivity!}
                 createActivity = {createActivity}
                 editActivity= {editActivity}
                 submitting ={submitting}
                  ></ActivityForm> }
            </GridColumn>
        </Grid>
    )
}
export default ActivityDashboard;