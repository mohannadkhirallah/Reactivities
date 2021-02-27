import { group } from 'console';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react'
import { Item , Label, Segment} from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ActivityListItem } from './ActivityListItem';

export const ActivityList:React.FC = () => {
    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;
    // const activityStore= useContext(ActivityStore);
    const {activitiesByDate} =activityStore;
    return (
        <Fragment>
          {activitiesByDate.map(([group,activities])=>(
            <Fragment key={group}>
              <Label size='large' color='blue'>{group}</Label>
                <Item.Group divided>
                  {activities.map(activity =>(
                <ActivityListItem activity={activity} ></ActivityListItem>
                ))}
                </Item.Group>
            </Fragment>
          ))}

      </Fragment>


    )
}
export default observer(ActivityList);