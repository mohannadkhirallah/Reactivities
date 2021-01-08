import React ,{useState,useEffect,Fragment} from  'react';
import axios from 'axios';
import { Container, Header, Icon, List } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../feature/nav/NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';
import { act } from '@testing-library/react';



const App = () => {
 const[activities,setActivities] = useState<IActivity[]>([]);
 const[selectedActivity,SetSelectedActivity] =useState<IActivity | null>(null);
 const[editMode,setEditMode]=useState(false);

  const handleSelectActivity = (id:string) =>
  {
    SetSelectedActivity(activities.filter(a=>a.id===id)[0]);
    setEditMode(false);
  };
  const handleOpenCreateForm = ()=>{
    SetSelectedActivity(null);
    setEditMode(true);
  };

  // Add new activity methods
  const handleCreateActivity =(activity:IActivity)=>
  {
    setActivities([...activities,activity]);
    SetSelectedActivity(activity);
    setEditMode(false);
  };
  // Edit Activity methods
  const handleUpdateActivity = (activity:IActivity) =>
  {
    setActivities([...activities.filter(a=>a.id !== activity.id),activity]);
    SetSelectedActivity(activity);
    setEditMode(false);
  };
  
  // Delete activity handlers
  const handleDeleteActivity = (id:string) =>{

    setActivities([...activities.filter(a=>a.id !== id)]);
  };
 
 useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
          .then((response=>{
            let activities:IActivity[]=[];
            response.data.forEach(actvity=>{
              actvity.date=actvity.date.split('.')[0];
              activities.push(actvity);
            });
            setActivities(activities);
          }));
 },[]);
  
    return (
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm}/>
        <Container style={{marginTop:'7em'}}>
          <ActivityDashboard
           activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity = {selectedActivity!}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={SetSelectedActivity}
            createActivity = {handleCreateActivity}
            editActivity = {handleUpdateActivity}
            deleteActivity= {handleDeleteActivity}
             ></ActivityDashboard>
        </Container>
      </Fragment>
    );

}
export default App;
