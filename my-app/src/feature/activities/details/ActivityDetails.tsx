import { observer } from 'mobx-react-lite';
import React, { useContext,useEffect } from 'react'
import {  RouteComponentProps } from 'react-router-dom';
import {  Grid } from 'semantic-ui-react';
import { LoadingCompnent } from '../../../app/layout/LoadingCompnent';
import ActivityStore from '../../../app/stores/activityStore';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedHeader } from './ActivityDetailedHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedSideBar } from './ActivityDetailedSideBar';

interface DetailsParams
{
  id:string
}
export const ActivityDetails:React.FC<RouteComponentProps<DetailsParams>> = ({match,history}) => {

    const activityStore= useContext(ActivityStore);
    const {selectedActivity:activity,LoadActivity,loadingInitial} = activityStore;

    useEffect(() => {
    LoadActivity(match.params.id)
    },[LoadActivity]);

    if(loadingInitial || !activity) return (<LoadingCompnent content='Loading activity...'></LoadingCompnent>)
    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity}/>
          <ActivityDetailedInfo activity={activity}/>
          <ActivityDetailedChat/>
        </Grid.Column>
        <Grid.Column width={6}>
        <ActivityDetailedSideBar/>
        </Grid.Column>
      </Grid>
    )
}
export default observer(ActivityDetails) ;