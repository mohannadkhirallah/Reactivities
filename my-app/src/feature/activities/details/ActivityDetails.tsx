import { observer } from 'mobx-react-lite';
import React, { useContext,useEffect } from 'react'
import { Link, matchPath, RouteChildrenProps, RouteComponentProps } from 'react-router-dom';
import { Card,Image,Icon, Button } from 'semantic-ui-react';
import { LoadingCompnent } from '../../../app/layout/LoadingCompnent';
import ActivityStore from '../../../app/stores/activityStore';

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
        <Card fluid>
        <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{activity!.title}</Card.Header>
          <Card.Meta>
            <span>{activity!.date}</span>
          </Card.Meta>
          <Card.Description>
            {activity!.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group widths={2}>
              <Button as={Link} to={`/manage/${activity!.id}`} basic color='blue' content="Edit" />
              <Button onClick={()=> history.push('/activities')} basic color='grey' content="Cancel"/>
          </Button.Group>
        </Card.Content>
      </Card>
    )
}
export default observer(ActivityDetails) ;