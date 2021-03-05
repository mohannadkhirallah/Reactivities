import { observer } from 'mobx-react-lite';
import React, { useContext,useEffect } from 'react'
import {  RouteComponentProps } from 'react-router-dom';
import {  Grid } from 'semantic-ui-react';
import { LoadingCompnent } from '../../../app/layout/LoadingCompnent';
import ActivityStore from '../../../app/stores/activityStore';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedHeader } from './ActivityDetailedHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedSideBar } from './ActivityDetailedSideBar';

interface DetailsParams
{
  id:string
}
export const ActivityDetails:React.FC<RouteComponentProps<DetailsParams>> = ({match,history}) => {

    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;
    // const activityStore= useContext(ActivityStore);
    const {selectedActivity:activity,LoadActivity,loadingInitial} = activityStore;

    useEffect(() => {
    LoadActivity(match.params.id)
    },[LoadActivity,match.params.id]);

    if(loadingInitial || !activity) return (<LoadingCompnent content='Loading activity...'></LoadingCompnent>)
    if(!activity) return <h2>activity not found</h2>
    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity}/>
          <ActivityDetailedInfo activity={activity}/>
          <ActivityDetailedChat/>
        </Grid.Column>
        <Grid.Column width={6}>
        <ActivityDetailedSideBar attendees ={activity.attendees}/>
        </Grid.Column>
      </Grid>
    )
}
export default observer(ActivityDetails) ;