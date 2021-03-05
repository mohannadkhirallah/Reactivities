import React, { useContext } from 'react';
import { Item , Button, Label, Segment, Icon} from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ActivityListItemAttendees } from './ActivityListItemAttendees';

export const ActivityListItem:React.FC<{activity:IActivity}> = ({activity}) => {
    const host = activity.attendees.filter( x=> x.isHost)[0];

    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;
    // const activityStore= useContext(ActivityStore);
    const {deleteActivity,submitting,target} =activityStore;
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                        <Item>
                        <Item.Image size='tiny' circular src={'/assets/user.png' || host.image}/>
                        <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                        <Item.Description> Hosted by {host.displayName} </Item.Description>
                        {activity.isHost &&
                        <Item.Description>
                        <Label basic color='orange'
                        content='You are hosting this activity' />
                         </Item.Description>
                        }

                        {activity.isGoing && !activity.isHost &&
                        <Item.Description>
                        <Label basic color='green'
                        content='You are going to this activity' />
                         </Item.Description>
                        }
                        </Item.Content>
                        </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock'/>{activity.date}
                <Icon name='marker'/>{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
               <ActivityListItemAttendees attendees ={activity.attendees}/>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to ={`/activities/${activity.id}`} floated='right' content='View' color='blue'></Button>
            </Segment>
        </Segment.Group>
        
    )
}
