import { observable, action,makeAutoObservable,computed,configure,runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { toast } from "react-toastify";
import agent from "../api/agent";
import {IActivity} from '../models/activity'

configure({enforceActions:'always'});

class ActivityStore{

    activityRegistry = new Map();
    loadingInitial = false;
    selectedActivity:IActivity |undefined;
    submitting =false;
    target='';

    constructor() {
        makeAutoObservable(this)
    }

    @computed get activitiesByDate(){
        console.log(this.groupActivitiesByDate( Array.from( this.activityRegistry.values())));
        return this.groupActivitiesByDate( Array.from( this.activityRegistry.values()));
    }; 
    
    groupActivitiesByDate( activities:IActivity[])
    {
        const sortedActivities= activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
        return Object.entries(sortedActivities.reduce((activities,activity)=>{
            const date=activity.date.split('T')[0];
            activities[date] =activities[date]?[...activities[date],activity]:[activity];
            return activities;
        },{}as {[key:string]:IActivity[]}));

    }

    @action loadActivities = async() => {
        this.loadingInitial=true;
        try
        {
            const activities= await agent.Activities.list();
            runInAction( ()=>{
                activities.forEach(actvity=>{
                    actvity.date=actvity.date.split('.')[0];
                    this.activityRegistry.set(actvity.id,actvity);
                  });
                  this.loadingInitial=false;
            });
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{
                this.loadingInitial=false;
            })
        }
    };

    @action LoadActivity =async (id:string) =>
    {
        // Getting atcivity from the activity list 
        // Or get activity from Data base that does does exist in the dashboard or refresh the page (no activity in the regirsty)
        let activity= this.getActivity(id);
        if(activity) {
            this.selectedActivity=activity;
        }
       else
       {
            this.loadingInitial=true;
            try
            {
                activity = agent.Activities.details(id);
                runInAction(()=>{
                    this.selectedActivity=activity;
                    this.loadingInitial=false;
        
                });
            }
            catch (ex)
            {
                console.log(ex);
                runInAction(()=>{
                    this.loadingInitial=false;
                });
            }
       } 

    };

    @action clearActivity=()=>{

        this.selectedActivity=undefined;
    };

    getActivity =(id:string) =>{
        return this.activityRegistry.get(id);
    };

    @action createActivity =async (activity:IActivity)=>
    {
        this.submitting=true;
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.submitting=false;
            });
        } catch (error) {
            console.log(error);
            toast.error('problem submitting data');
            runInAction(()=>{
                this.submitting=false;
            })
        }

    };
    @action editActivity = async(activity:IActivity)=>{

        this.submitting= true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{

                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.submitting=false;
            })

        } catch (error) {
            runInAction(()=>{
                this.submitting=false;
            })
            toast.error('problem submitting data');
            console.log(error);
        }

    };

    @action deleteActivity = async (event:SyntheticEvent<HTMLButtonElement>,id:string) =>{

        this.submitting=true;
        try {

            this.target=event.currentTarget.name;
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);
                this.submitting=false;
            })
 
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.submitting=false;
            })

        }
    };

}
export default createContext(new ActivityStore())