import { observable, action,makeAutoObservable,computed,configure,runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import {IActivity} from '../models/activity'

configure({enforceActions:'always'});

class ActivityStore{

    activityRegistry = new Map();
    activities:IActivity[] =[];
    loadingInitial = false;
    selectedActivity:IActivity |undefined;
    editMode= false;
    submitting =false;
    target='';

    constructor() {
        makeAutoObservable(this)
    }

    @computed get activitiesByDate(){
        return Array.from( this.activityRegistry.values()).slice().sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }; 

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

    @action createActivity =async (activity:IActivity)=>
    {
        this.submitting=true;
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.editMode=false;
                this.submitting=false;
            });


        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.submitting=false;
            })
        }

    };

    @action openCreateForm =() => {
        this.editMode=true;
        this.selectedActivity = undefined;
    };

    @action openEditForm =(id:string) =>{

        this.selectedActivity =this.activityRegistry.get(id);
        this.editMode=true;
    };

    @action cancelSelectedActivity = () =>{

        this.selectedActivity=undefined;
    };
    @action cancelFormOpen= ()=>{

        this.editMode=false;
    };

    @action selectActivity =(id:string) =>{
        this.selectedActivity= this.activityRegistry.get(id);
        this.editMode=false;
    };

    @action editActivity = async(activity:IActivity)=>{

        this.submitting= true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{

                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.submitting=false;
            })

        } catch (error) {
            runInAction(()=>{
                this.submitting=false;
            })
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