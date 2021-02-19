export interface IActivity{

    id:string;
    title:string;
    description:string;
    date:string;
    city:string;
    venue:string;
    category:string;

}
export class ActivityFormValues implements IActivity
{
    id: string = '';
    title: string='';
    description: string='';
    date: string='';
    city: string='';
    venue: string='';
    category: string='';


    constructor(init?:IActivity){
        if(init)
        {
            Object.assign(this,init);
        }
    }
}