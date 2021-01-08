import React ,{useState,useEffect,Fragment, SyntheticEvent} from  'react';
import { Container, Header, Icon, List } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../feature/nav/NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';
import { act } from '@testing-library/react';
import agent from '../api/agent';
import { LoadingCompnent } from './LoadingCompnent';



const App = () => {
 const[activities,setActivities] = useState<IActivity[]>([]);
 const[selectedActivity,SetSelectedActivity] =useState<IActivity | null>(null);
 const[editMode,setEditMode]=useState(false);
 const[loading, setLoading] = useState(true);
 const[submitting, setSubmitting]= useState(false);
const [target,setTarget] =useState('');
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
    setSubmitting(true);
    agent.Activities.create(activity).then(()=>{
      setActivities([...activities,activity]);
      SetSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmitting(false))
  };
  // Edit Activity methods
  const handleUpdateActivity = (activity:IActivity) =>
  {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a=>a.id !== activity.id),activity]);
      SetSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false))
  };
  
  // Delete activity handlers
  const handleDeleteActivity = (event:SyntheticEvent<HTMLButtonElement> , id:string) =>{
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() =>{
      setActivities([...activities.filter(a=>a.id !== id)]);
    }).then(()=>setSubmitting(false))
  };
 
 useEffect(() => {
    // axios.get<IActivity[]>('http://localhost:5000/api/activities')
    agent.Activities.list()
          .then((response=>{
            let activities:IActivity[]=[];
            response.forEach(actvity=>{
              actvity.date=actvity.date.split('.')[0];
              activities.push(actvity);
            });
            setActivities(activities);
          })).then(()=>setLoading(false));
 },[]);
  
 if(loading) return <LoadingCompnent content='Loading activites...'></LoadingCompnent>

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
            submitting = {submitting}
            target ={target}
             ></ActivityDashboard>
        </Container>
      </Fragment>
    );

}
export default App;
