import React, { useContext } from 'react';
import { Item , Button, Label, Segment, Icon} from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ActivityListItem:React.FC<{activity:IActivity}> = ({activity}) => {
    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;
    // const activityStore= useContext(ActivityStore);
    const {deleteActivity,submitting,target} =activityStore;
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                        <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png'/>
                        <Item.Content>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Description> Hosted by Bob </Item.Description>
                        </Item.Content>
                        </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock'/>{activity.date}
                <Icon name='marker'/>{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attenddess will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to ={`/activities/${activity.id}`} floated='right' content='View' color='blue'></Button>
            </Segment>
        </Segment.Group>
        
    )
}
