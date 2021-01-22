import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import {IActivity} from '../models/activity';

//Setting base  URI
axios.defaults.baseURL = 'http://localhost:5000/api';

//handle error 
axios.interceptors.response.use(undefined, (error)=>{

    const {status,data,config} = error.response;
    if(status === 404)
    {
        history.push('/notfound');
    }
    if(status === 400)
    {
        history.push('/notfound');
    }
    console.log(error.response);

    if(status === 500)
    {
        toast.error('service error - check the terminal for more infor!');
    }

});

const responseBody=(response: AxiosResponse) =>response.data;
const sleep= (ms:number) =>(response:AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response),ms));

const requests = {

    get: (url:string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url:string,body:{}) => axios.post(url,body).then(sleep(1000)).then(responseBody),
    put : (url:string,body:{}) => axios.put(url,body).then(sleep(1000)).then(responseBody),
    del: (url:string) => axios.delete(url).then(sleep(1000)).then(responseBody)

}

const Activities ={

    list:():Promise<IActivity[]> => requests.get('/activities'),
    details: (id:string) => requests.get(`/activities/${id}`),
    create: (activity:IActivity) => requests.post('/activities',activity),
    update: (activit:IActivity)  => requests.put(`/activities/${activit.id}`,activit),
    delete: (id:string) => requests.del(`/activities/${id}`)

}

export default {
    Activities
}
